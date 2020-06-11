import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import {BehaviorSubject, Subject, Observable} from 'rxjs';
import {UrlBuilder} from '../url-builder';
import {Task} from '../task';

PouchDB.plugin(PouchDBFind);

class TasksStorage {
  /**
   * @param {UrlBuilder} localUrlBuilder
   * @param {UrlBuilder} remoteUrlBuilder
   */
  constructor(localUrlBuilder, remoteUrlBuilder, localOpts, remoteOpts) {
    this.localUrlBuilder = localUrlBuilder;
    this.remoteUrlBuilder = remoteUrlBuilder;
    this.localOpts = localOpts;
    this.remoteOpts = remoteOpts;

    this.localDB = new PouchDB(this.localUrlBuilder.getUrl(), localOpts);

    /**
     * @type {BehaviorSubject<{id, content, done, _id, _rev}[]>}
     */
    this._tasks$ = new BehaviorSubject(null);

    if (this.remoteUrlBuilder) {
      this.remoteDB = new PouchDB(this.remoteUrlBuilder.getUrl(), remoteOpts);

      // PouchDB.sync(this.localDB, this.remoteDB, {live: true}).on(
      //   'active',
      //   () => {
      //     this.fetchAll();
      //   },
      // );
    }
  }

  /**
   * @returns {Observable<{id, content, done, _id, _rev}[]>}
   */
  get tasks() {
    // initial fetch. the lazy pattern ensures that this is called only once.
    this.fetchAll();

    // lazy getter/value pattern
    delete this.tasks;
    Object.defineProperty(this, 'tasks', {
      value: this._tasks$.asObservable(),
    });
    return this.tasks;
  }

  // TODO: reconnect databases to these two urls.
  async connectTo(token) {
    await this.localDB.close();
    this.localUrlBuilder.setDatabaseName(`a${token}`);
    this.localDB = new PouchDB(this.localUrlBuilder.getUrl(), this.localOpts);

    if (this.remoteUrlBuilder) {
      await this.remoteDB.close();
      this.remoteUrlBuilder.setDatabaseName(`a${token}`);
      this.remoteDB = new PouchDB(
        this.remoteUrlBuilder.getUrl(),
        this.remoteOpts,
      );
    }

    await this.fetchAll();
  }

  fetchAll() {
    return this.localDB
      .allDocs({
        include_docs: true,
      })
      .then((response) => {
        this._tasks$.next(
          response.rows
            .filter((row) => !row.value.deleted)
            .map((row) => row.doc),
        );
      })
      .catch((err) => {
        console.error('ERROR', err);
      });
  }

  async _getById(id) {
    return await this.localDB
      .find({
        selector: {
          id,
        },
      })
      .then((res) => res.docs[0]);
  }

  /**
   * @param {Task[]} tasks
   */
  async save(...tasks) {
    const jsonTasks = tasks.map((task) => task.toJSON());
    const res = await this.localDB.bulkDocs(jsonTasks);

    if (this.remoteDB) {
      // no `await` so the slow change in remote will happen asynchronously!
      this.remoteDB.bulkDocs(jsonTasks);
    }
    await this.fetchAll();
  }

  /**
   * @param {Task[]} tasks
   */
  async update(...tasks) {
    const updatedTasks = await Promise.all(
      tasks.map(async (task) => {
        const t = await this._getById(task.id);
        return {
          ...t,
          ...task.toJSON(),
        };
      }),
    );
    const res = await this.localDB.bulkDocs(updatedTasks);

    if (this.remoteDB) {
      this.remoteDB.bulkDocs(updatedTasks);
    }
    await this.fetchAll();
  }

  /**
   * @param {Task[]} tasks
   */
  async delete(...tasks) {
    const updatedTasks = await Promise.all(
      tasks.map(async (task) => {
        const t = await this._getById(task.id);
        return {
          ...t,
          ...task.toJSON(),
          _deleted: true,
        };
      }),
    );
    const res = await this.localDB.bulkDocs(updatedTasks);

    if (this.remoteDB) {
      this.remoteDB.bulkDocs(updatedTasks);
    }
    await this.fetchAll();
  }

  async clearStorage() {
    const {rows} = await this.localDB.allDocs();
    let remoteDocs = null;
    if (this.remoteDB) {
      remoteDocs = await this.remoteDB.allDocs();
    }
    await Promise.all(
      rows.map(async (row) => {
        await this.localDB.remove(row.id, row.value.rev);
      }),
      remoteDocs
        ? remoteDocs.rows.map(async (row) => {
            await this.remoteDB.remove(row.id, row.value.rev);
          })
        : Promise.resolve(),
    );

    await this.fetchAll();
  }

  closeConnection() {
    this.localDB.close();

    if (this.remoteDB) {
      this.remoteDB.close();
    }
  }
}

export {TasksStorage};

import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import {BehaviorSubject, Subject, Observable} from 'rxjs';
import {UrlBuilder} from '../url-builder';
import {Task} from '../task';

PouchDB.plugin(PouchDBFind);

class TasksStorage {
  constructor(localUrl, remoteUrl, localOpts, remoteOpts) {
    if (!localUrl.trim()) {
      throw new Error('TasksStorage initialized without local url.');
    }
    this.localUrl = localUrl;
    this.remoteUrl = remoteUrl;

    this.localDB = new PouchDB(this.localUrl, localOpts);

    /**
     * @type {BehaviorSubject<{id, content, done, _id, _rev}[]>}
     */
    this._tasks$ = new BehaviorSubject(null);

    if (this.remoteUrl) {
      this.remoteDB = new PouchDB(this.remoteUrl, remoteOpts);

      PouchDB.sync(this.remoteDB, this.localDB, {live: true}).on(
        'complete',
        () => this.fetchAll(),
      );
    }
  }

  /**
   * @returns {Observable<{id, content, done, _id, _rev}[]>}
   */
  get tasks() {
    if (!this.remoteDB) {
      // initial fetch. the lazy pattern ensures that this is called only once.
      this.fetchAll();
    }
    // lazy getter/value pattern
    delete this.tasks;
    Object.defineProperty(this, 'tasks', {
      value: this._tasks$.asObservable(),
    });
    return this.tasks;
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
    const res = await this.localDB.bulkDocs(tasks.map((task) => task.toJSON()));
    if (!this.remoteDB) {
      await this.fetchAll();
    }
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
    if (!this.remoteDB) {
      await this.fetchAll();
    }
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
    if (!this.remoteDB) {
      await this.fetchAll();
    }
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
    if (!this.remoteDB) {
      await this.fetchAll();
    }
  }

  closeConnection() {
    this.localDB.close();

    if (this.remoteDB) {
      this.remoteDB.close();
    }
  }
}

export {TasksStorage};

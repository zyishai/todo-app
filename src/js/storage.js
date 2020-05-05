import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { Task } from './task';

PouchDB.plugin(PouchDBFind);

export class StorageAdapter {
    constructor(builder) {
        this.urlBuilder = builder;
        this.db = new PouchDB(this.urlBuilder.getUrl());
    }

    async _getDocById(id) {
        return await this.db.find({
            selector: {
                id
            }
        }).then(res => res.docs[0]);
    }

    async _getAllDocs(opts) {
        return await this.db.allDocs({
            include_docs: true,
            ...opts
        });
    }

    connectTo(userToken) {
        this.urlBuilder.setDatabaseName('a' + userToken);
        this.db = new PouchDB(this.urlBuilder.getUrl());
    }

    async resetDatabase() {
        const docs = await this._getAllDocs();

        return Promise.all(docs.rows.map(({ doc }) => this.db.remove(doc)));
    }

    async fetchAllTasks() {
        const allDocs = await this._getAllDocs();
        return allDocs.rows.map(({ doc }) => new Task(doc.id, doc.content, doc.done));
    }

    async persistTask(task) {
        return await this.db.post(task.toJSON());
    }

    async updateTask(task) {
        const { _rev, _id } = await this._getDocById(task.id);
        return await this.db.put({
            _id,
            _rev,
            ...task.toJSON()
        });
    }

    async deleteTask(taskId) {
        const taskDoc = await this._getDocById(taskId);
        return await this.db.remove(taskDoc._id, taskDoc._rev);
    }

    async clearAllFinishedTasks() {
        const allTaskRows = (await this._getAllDocs()).rows;
        return Promise.all(allTaskRows.map(row => {
            if (row.doc.done) {
                return this.db.remove(row.doc._id, row.value.rev);
            } else {
                return Promise.resolve();
            }
        }));
    }
}
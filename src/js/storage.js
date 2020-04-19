import PouchDB from 'pouchdb';
import { Task } from './task';

export class StorageAdapter {
    constructor(url) {
        this.db = new PouchDB(url);
    }

    async _getDocById(id) {
        return await this.db.get(id);
    }

    async _getAllDocs(opts) {
        return await this.db.allDocs({
            include_docs: true,
            ...opts
        });
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
        return await this.db.put({
            _id: task.id,
            ...task.toJSON()
        });
    }

    async updateTask(task) {
        const { _rev } = await this.db.get(task.id);
        return await this.db.put({
            _id: task.id,
            _rev,
            ...task.toJSON()
        });
    }

    async deleteTask(taskId) {
        const taskDoc = await this._getDocById(taskId);
        return await this.db.remove(taskDoc.id, taskDoc._rev);
    }

    async clearAllFinishedTasks() {
        const allTaskRows = (await this._getAllDocs()).rows;
        return Promise.all(allTaskRows.map(row => {
            if (row.doc.done) {
                return this.db.remove(row.doc.id, row.value.rev);
            } else {
                return Promise.resolve();
            }
        }));
    }
}
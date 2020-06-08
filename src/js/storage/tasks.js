import PouchDB from 'pouchdb';
import PouchMemoryAdapterPlugin from 'pouchdb-adapter-memory';
import { BehaviorSubject, Subject } from 'rxjs';
import { UrlBuilder } from '../url-builder';

PouchDB.plugin(PouchMemoryAdapterPlugin);

export class TasksStorage {
    constructor(urlBuilder) {
        if (!urlBuilder || !(urlBuilder instanceof UrlBuilder)) {
            throw new Error('Url builder missing or invalid!');
        }
        this.urlBuilder = urlBuilder;
        this.localDatabase = null;
        this.remoteDatabase = null;
        this._tasks = new Subject();
    }

    get tasks() {
        return this._tasks.asObservable();
    }

    async connectTo(token) {
        this.urlBuilder.setDatabaseName(`a${token}`);

        // setup remote database
        if (this.urlBuilder.getRemoteUrl()) {
            this.remoteDatabase = new PouchDB(this.urlBuilder.getRemoteUrl(), {
                adapter: 'memory'
            });
        }

        // setup local database
        this.localDatabase = new PouchDB(this.urlBuilder.getLocalUrl(), {
            adapter: 'memory'
        });

        this._tasks.next();
    }

    save(...tasks) {}

    update(...tasks) {}

    delete(...tasks) {}
}
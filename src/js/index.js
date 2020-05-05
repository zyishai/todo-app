import { Main } from './main';
import litHtmlAdapter from './dom/adapter';
import { AppState } from './state';
import { StorageAdapter } from './storage';
import { UserManager } from './user-manager';

;(function() {
    function constructRemoteStorageUrl() {
        const username = process.env.REMOTE_STORAGE_USERNAME;
        const password = process.env.REMOTE_STORAGE_PASSWORD;
        const host = process.env.REMOTE_STORAGE_URL_HOST;
        const databaseName = process.env.STORAGE_DB_NAME;
        return host 
            ? username && password
                ? `http://${username}:${password}@${host}/${databaseName}`
                : `http://${host}/${databaseName}`
            : databaseName;

    }
    const appState = new AppState(new StorageAdapter(constructRemoteStorageUrl()));
    const userManager = new UserManager(localStorage);
    Main.init(litHtmlAdapter, appState, userManager);
})()
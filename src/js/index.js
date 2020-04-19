require('dotenv').config();
import { Main } from './main';
import litHtmlAdapter from './dom-adapter';
import { AppState } from './state';
import { StorageAdapter } from './storage';

;(function() {
    const appState = new AppState(new StorageAdapter(process.env.REMOTE_STORAGE_URL));
    Main.init(litHtmlAdapter, appState);
})()
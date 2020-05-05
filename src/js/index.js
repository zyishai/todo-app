import { Main } from './main';
import litHtmlAdapter from './dom/adapter';
import { AppState } from './state';
import { StorageAdapter } from './storage';
import { UserManager } from './user-manager';
import { UrlBuilder } from './url-builder';

;(function() {
    const appState = new AppState(new StorageAdapter(new UrlBuilder()));
    const userManager = new UserManager(localStorage);
    Main.init(litHtmlAdapter, appState, userManager);
})()
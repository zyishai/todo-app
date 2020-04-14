import { Main } from './main';
import litHtmlAdapter from './dom-adapter';
import { AppState } from './state';
import { LocalStorageWrapper } from './storage';

;(function() {
    Main.init(litHtmlAdapter, new AppState(new LocalStorageWrapper()));
})()
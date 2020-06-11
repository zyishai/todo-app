import {Main} from './main';
import litHtmlAdapter from './dom/adapter';
import {TasksStorage} from './storage';
import {State} from './state';
import {UserManager} from './user-manager';
import {UrlBuilder} from './url-builder';

(function () {
  const localUrlBuilder = new UrlBuilder().setDatabaseName(
    process.env.STORAGE_DB_NAME,
  );
  const remoteUrlBuilder = new UrlBuilder()
    .setHostName(process.env.REMOTE_STORAGE_URL_HOST)
    .setUser(process.env.REMOTE_STORAGE_USERNAME)
    .setPassword(process.env.REMOTE_STORAGE_PASSWORD)
    .setDatabaseName(process.env.STORAGE_DB_NAME);
  const state = new State(new TasksStorage(localUrlBuilder, remoteUrlBuilder));
  const userManager = new UserManager(localStorage);
  Main.init(litHtmlAdapter, state, userManager);
})();

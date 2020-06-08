import {expect} from 'chai';
import {TasksStorage} from '../src/js/storage/tasks';
import {UrlBuilder} from '../src/js/url-builder';

require('dotenv').config({
  path: '.env.local',
});

test('calling `connectTo()`, set the local and remote databases to the token specified', async function () {
  const urlBuilder = new UrlBuilder();
  const storage = new TasksStorage(urlBuilder);
  storage.connectTo('__mocha__');

  const localDatabaseInfo = await storage.localDatabase.info();
  const localDatabaseName = localDatabaseInfo.db_name;
  expect(localDatabaseName).to.equal('a__mocha__');

  const remoteDatabaseInfo = await storage.remoteDatabase.info();
  const remoteDatabaseName = remoteDatabaseInfo.db_name;
  expect(remoteDatabaseName).to.equal(urlBuilder.getRemoteUrl());
});

test.skip('calling `connectTo()` should emit tasks from the newly connected database', function (done) {
  const urlBuilder = new UrlBuilder();
  const storage = new TasksStorage(urlBuilder);
  storage.connectTo('__mocha__');
  storage.tasks.subscribe(
    (data) => {
      expect(Array.isArray(data)).to.be.true;
      done();
    },
    (err) => {
      console.error(err.toString());
      done();
    },
    () => {
      console.log('Finished!');
      done();
    },
  );
});

teardown(async function () {
  const storage = new TasksStorage(new UrlBuilder());
  storage.connectTo('__mocha__');

  await storage.remoteDatabase.destroy();
});

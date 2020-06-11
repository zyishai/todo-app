import {expect} from 'chai';
import {spy} from 'sinon';
import {Storage as AppStorage} from '../src/js/storage';
import {UrlBuilder} from '../src/js/url-builder';
import {Task} from '../src/js/task';

/**
 * @type {AppStorage}
 */
let storage = null;

suite('Tasks Storage', () => {
  setup(async function () {
    const builder = new UrlBuilder().setDatabaseName('__mocha__');
    storage = new AppStorage(builder);
    await storage.clearStorage();
  });

  test('upon initialization a storage should pass tasks data to tasks observable', (done) => {
    let times = 0;
    storage.tasks.subscribe(function (res) {
      if (res && times === 0) {
        done(null);
        times++;
      }
    });
  });

  test('calling connectTo should reconnect databases and fetch new data', async () => {
    spy(storage);
    await storage.connectTo('__bla__');

    expect(storage.localDB.name).to.equal('a__bla__');
    expect(storage.fetchAll).to.have.been.called;
  });

  test('saving a task should emit observable value', async () => {
    const task = new Task('unit test');
    await storage.save(task);

    const tasks = storage._tasks$.value;
    expect(tasks.find((t) => t.id === task.id)).to.have.property(
      'content',
      task.content,
    );
    expect(tasks.find((t) => t.id === task.id)).to.have.property(
      'done',
      task.done,
    );
  });

  test('updating a task should emit observable value', async () => {
    const task = new Task('unit test');
    await storage.save(task);
    task.toggleState();
    await storage.update(task);
    expect(
      storage._tasks$.value.find((t) => t.id === task.id),
    ).to.have.property('done', task.done);
  });

  test('deleting a task should emit observable value', async () => {
    const task = new Task('unit test');
    await storage.save(task);
    await storage.delete(task);
    expect(storage._tasks$.value.find((t) => t.id === task.id)).to.be.undefined;
  });

  test('calling clearStorage should remove all docs', async () => {
    const firstTask = new Task('unit test 1');
    const secondTask = new Task('unit test 2');

    await storage.save(firstTask, secondTask);
    await storage.clearStorage();

    expect(storage._tasks$.value).to.be.empty;
  });

  teardown(async function () {
    await storage.localDB.destroy();

    if (storage.remoteDB) {
      await storage.remoteDB.destroy();
    }
  });
});

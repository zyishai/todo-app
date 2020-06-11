import {expect} from 'chai';
import sinon from 'sinon';
import PouchDB from 'pouchdb';
import PouchMemoryAdapter from 'pouchdb-adapter-memory';
import {Storage as AppStorage} from '../src/js/storage';
import {State} from '../src/js/state';
import {Task} from '../src/js/task';
import {UrlBuilder} from '../src/js/url-builder';

suite('State', () => {
  PouchDB.plugin(PouchMemoryAdapter);

  /**
   * @type {AppStorage}
   */
  let storage = null;
  /**
   * @type {State}
   */
  let state = null;

  setup(async () => {
    const urlBuilder = new UrlBuilder().setDatabaseName('__mocha__');
    storage = new AppStorage(urlBuilder, null, {
      adapter: 'memory',
    });
    await storage.clearStorage();
    state = new State(storage);
  });

  test("calling syncStorageFrom should call storage's connectTo with the appropriate urls", async () => {
    sinon.spy(storage);
    await state.syncStorageFrom('foo');

    expect(storage.connectTo).to.have.been.calledWith('foo');
  });

  test('upon subscription should emit tasks', async () => {
    const tasksObservableSpy = sinon.fake();

    state.tasks.subscribe(tasksObservableSpy, null, null);

    expect(tasksObservableSpy).to.be.calledWithMatch([]);
  });

  test('upon subscription should emit categories', async () => {
    const categoriesObservableSpy = sinon.fake();
    await state.addNewTask('unit test');

    state.categories.subscribe(categoriesObservableSpy, null, null);

    expect(categoriesObservableSpy).to.be.calledWithMatch(new Set(['Default']));
  });

  test('upon subscription should emit selected category', () => {
    state.selectedCategory.subscribe((selectedCategory) => {
      expect(selectedCategory).to.match(/Default/i);
    });
  });

  test('CRUD operations on tasks should be reflected in storage', async () => {
    const tasksObservableSpy = sinon.fake();

    state.tasks.subscribe(tasksObservableSpy);

    const assertedTask = await state.addNewTask('unit test');
    expect(tasksObservableSpy.thirdCall.lastArg[0].content).to.equal(
      'unit test',
    );

    await state.toggleTaskState(assertedTask.id);

    // calls count start from 0!! this is the 4th call.
    expect(tasksObservableSpy.getCall(3).lastArg[0].done).to.equal(true);

    await state.updateTaskContent(assertedTask.id, 'updated');

    expect(tasksObservableSpy.getCall(4).lastArg[0].content).to.equal(
      'updated',
    );

    await state.deleteTask(assertedTask.id);

    expect(tasksObservableSpy.getCall(5).lastArg).to.deep.equal([]);
  });

  test('call to clearAllFinishedTasks should reflected in storage', async () => {
    const tasksObservableSpy = sinon.fake();
    state.tasks.subscribe(tasksObservableSpy);

    const task = await state.addNewTask('foo');
    await state.toggleTaskState(task.id);
    await state.clearAllFinishedTasks();

    expect(tasksObservableSpy.getCall(4).lastArg).to.deep.equal([]);
  });

  test('call to clearAllTasks should reflected in storage', async () => {
    const tasksObservableSpy = sinon.fake();
    state.tasks.subscribe(tasksObservableSpy);

    await state.clearAllTasks();
    expect(tasksObservableSpy.thirdCall.lastArg).to.deep.equal([]);
  });
});

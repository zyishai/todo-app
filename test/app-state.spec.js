import {expect} from 'chai';
import sinon from 'sinon';
import PouchDB from 'pouchdb';
import PouchMemoryAdapter from 'pouchdb-adapter-memory';
import {TasksStorage} from '../src/js/storage';
import {State} from '../src/js/state';
import {Task} from '../src/js/task';

suite('State', () => {
  PouchDB.plugin(PouchMemoryAdapter);

  let storage = null;
  /**
   * @type {State}
   */
  let state = null;

  setup(async () => {
    storage = new TasksStorage('__mocha__', null, {
      adapter: 'memory',
    });
    await storage.clearStorage();
    state = new State(storage);
  });

  test('upon initialization should emit tasks', async () => {
    const tasksObservableSpy = sinon.fake();

    state.tasks.subscribe(tasksObservableSpy);

    expect(tasksObservableSpy).to.be.calledWithMatch([]);
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

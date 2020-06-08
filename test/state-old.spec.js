import { expect } from 'chai';
import { spy } from 'sinon';
import { AppState } from '../src/js/state-old';
import AppStateEvents from '../src/js/app-state-events';
import { StorageAdapter } from '../src/js/storage-old';
import { UrlBuilder } from '../src/js/url-builder';

setup(function() {
    // make sure that the tasks got loaded from the storage before
    // starting the tests.
    return new Promise(async (resolve) => {
        // create storage adapter and state
        this.storageAdapter = new StorageAdapter(new UrlBuilder());
        this.state = new AppState(this.storageAdapter);

        // reset the db and register `sync` event listener
        await this.storageAdapter.resetDatabase();
        this.state.onTasksSyncEvent(resolve);

        // spy on state methods and start syncing from remote storage
        spy(this.state);
        this.state._syncFromStorage();
    });
});

test('initial state should come from `storage`', async function() {
    spy(this.state.storage);
    expect(this.state.tasks).to.deep.equal(await this.state.storage.fetchAllTasks());
});

test('calling addNewTask() should save the task in the state', async function() {
    await this.state.addNewTask('Example task');

    expect(this.state.tasks).to.be.lengthOf(1);
});

test('calling addNewTask() should call storage.persistTask()', async function() {
    spy(this.state.storage);
    await this.state.addNewTask('Example task');

    expect(this.state.storage.persistTask).to.be.called;
});

test('calling addNewTask() should emit `new task` event', async function() {
    // act
    const task = await this.state.addNewTask('Example task');

    // assert
    expect(this.state.emit).to.be.calledWith(AppStateEvents.NEW_TASK_ADDED_EVENT, task);
});

test('calling addNewTask() should emit `sync` event', async function() {
    await this.state.addNewTask('test');

    expect(this.state.emit).to.be.calledWith(AppStateEvents.TASKS_SYNC);
});

test('calling toggleTaskState() should toggle `task.done` and emit `task state changed` event with the task id, prev state and new state', async function() {
    const task = await this.state.addNewTask('Example');

    await this.state.toggleTaskState(task.id);

    expect(this.state._getById(task.id).done).to.be.true;
    expect(this.state.emit).to.be.deep.calledWith(AppStateEvents.TASK_STATE_CHANGED_EVENT, {
        taskId: task.id,
        prevState: false,
        newState: true
    });

    // should return task.done to be false
    await this.state.toggleTaskState(task.id);

    expect(task.done).to.be.false;
});

test('calling toggleTaskState() should call storage.updateTask', async function() {
    spy(this.state.storage);
    const task = await this.state.addNewTask('Example task');

    await this.state.toggleTaskState(task.id);

    expect(this.state.storage.updateTask).to.be.called;
});

test('calling toggleTaskState() should emit `sync` event', async function() {
    const task = await this.state.addNewTask('test');
    await this.state.toggleTaskState(task.id);

    expect(this.state.emit).to.be.calledWith(AppStateEvents.TASKS_SYNC);
});

test('calling updateTaskContent() should set task\'s content property and emit `task content update` event', async function() {
    const task = await this.state.addNewTask('Example');

    await this.state.updateTaskContent(task.id, 'Two words');

    expect(this.state._getById(task.id).content).to.equal('Two words');
    expect(this.state.emit).to.be.deep.calledWith(AppStateEvents.TASK_CONTENT_UPDATED_EVENT, {
        taskId: task.id,
        prevContent: 'Example',
        newContent: 'Two words'
    });
});

test('calling updateTaskContent() should call storage.updateTask', async function() {
    spy(this.state.storage);
    const task = await this.state.addNewTask('Example task');

    await this.state.updateTaskContent(task.id, 'Two words');

    expect(this.state.storage.updateTask).to.be.called;
});

test('calling updateTaskContent() should emit `sync` event', async function() {
    const task = await this.state.addNewTask('test');
    await this.state.updateTaskContent(task.id, 'Hello world');

    expect(this.state.emit).to.be.calledWith(AppStateEvents.TASKS_SYNC);
});

test('when calling deleteTask() the task should be removed from state', async function() {
    const task = await this.state.addNewTask('Test');

    await this.state.deleteTask(task.id);

    expect(this.state.tasks).to.not.contain(task);
});

test('when calling deleteTask(), storage.deleteTask() should be called', async function() {
    spy(this.state.storage);
    const task = await this.state.addNewTask('Test');

    await this.state.deleteTask(task.id);

    expect(this.state.storage.deleteTask).to.be.calledWith(task.id);
});

test('when calling deleteTask(), `tasks deleted` event should be emitted', async function() {
    const task = await this.state.addNewTask('Test');

    await this.state.deleteTask(task.id);

    expect(this.state.emit).to.be.deep.calledWith(AppStateEvents.TASKS_DELETED_EVENT, [
        task.id
    ]);
});

test('calling deleteTask() should emit `sync` event', async function() {
    const task = await this.state.addNewTask('test');
    await this.state.deleteTask(task.id);

    expect(this.state.emit).to.be.calledWith(AppStateEvents.TASKS_SYNC);
});

test('calling clearAllFinishedTasks() should remove all finished tasks', async function() {
    await this.state.addNewTask('First task');
    const toBeClearedTask = await this.state.addNewTask('Second task');
    await this.state.toggleTaskState(toBeClearedTask.id);
    await this.state.addNewTask('Third task');
    await this.state.clearAllFinishedTasks();

    expect(this.state.tasks)
        .to.have.lengthOf(2)
        .and
        .to.not.deep.include(toBeClearedTask.toJSON());
});

test('calling clearAllFinishedTasks() should call storage.clearAllFinishedTasks()', async function() {
    spy(this.state.storage);
    await this.state.addNewTask('First task');
    await this.state.addNewTask('Second task');
    await this.state.addNewTask('Third task');
    await this.state.clearAllFinishedTasks();

    expect(this.state.storage.clearAllFinishedTasks).to.be.called;
});

test('calling clearAllFinishedTasks() should emit `tasks deleted` event', async function() {
    await this.state.addNewTask('First task');
    await this.state.addNewTask('Second task');
    await this.state.addNewTask('Third task');
    await this.state.clearAllFinishedTasks();

    expect(this.state.emit).to.be.deep.calledWith(AppStateEvents.TASKS_DELETED_EVENT);
});

test('calling clearAllFinishedTasks() should emit `sync` event', async function() {
    await this.state.clearAllFinishedTasks();

    expect(this.state.emit).to.be.calledWith(AppStateEvents.TASKS_SYNC);
});

test('calling onTasksSyncEvent() should registered listener for `sync` events', function() {
    this.state.onTasksSyncEvent(() => {
        expect(true).to.be.true;
    });

    this.state.emit(AppStateEvents.TASKS_SYNC);
});

test('calling onNewTaskEvent() should registered listener for `new event` events', function() {
    this.state.onNewTaskEvent(() => {
        expect(true).to.be.true;
    });

    this.state.emit(AppStateEvents.NEW_TASK_ADDED_EVENT);
});

test('calling onTaskStateChangedEvent() should registered listener for `task state changed` events', function() {
    this.state.onTaskStateChangedEvent(() => {
        expect(true).to.be.true;
    });

    this.state.emit(AppStateEvents.TASK_STATE_CHANGED_EVENT);
});

test('calling onTaskContentUpdatedEvent() should registered listener for `task content changed` events', function() {
    this.state.onTaskContentUpdatedEvent(() => {
        expect(true).to.be.true;
    });

    this.state.emit(AppStateEvents.TASK_CONTENT_UPDATED_EVENT);
});

test('calling onSingleTaskDeletedEvent() should registered listener for `tasks deleted` events', function() {
    this.state.onSingleTaskDeletedEvent(() => {
        expect(true).to.be.true;
    });

    this.state.emit(AppStateEvents.TASKS_DELETED_EVENT);
});

test('calling onMultipleTasksDeletedEvent() should registered listener for `tasks deleted` events', function() {
    this.state.onMultipleTasksDeletedEvent(() => {
        expect(true).to.be.true;
    });

    this.state.emit(AppStateEvents.TASKS_DELETED_EVENT);
});
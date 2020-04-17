import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { AppState } from '../src/js/state';
import AppStateEvents from '../src/js/app-state-events';
import { LocalStorageWrapper } from '../src/js/storage';

suiteSetup(function() {
    let store = {};

    const fakeLocalStorage = {
        getItem: stub().callsFake(function(key) {
            return store[key];
        }),
        setItem: stub().callsFake(function(key, value) {
            store[key] = value + '';
        }),
        clear: stub().callsFake(function() {
            store = {};
        })
    }

    globalThis.localStorage = fakeLocalStorage;
});

setup(function() {
    this.state = new AppState(new LocalStorageWrapper());
    spy(this.state);
});

test('initial state should come from `storage`', function() {
    spy(this.state.storage);
    expect(this.state.tasks).to.deep.equal(this.state.storage.fetchAllTasks());
});

test('calling addNewTask() should save the task in the state', function() {
    this.state.addNewTask('Example task');

    expect(this.state.tasks).to.be.lengthOf(1);
});

test('calling addNewTask() should call storage.persistTask()', function() {
    spy(this.state.storage);
    this.state.addNewTask('Example task');

    expect(this.state.storage.persistTask).to.be.called;
});

test('calling addNewTask() should emit `new task` event', function() {
    // act
    const task = this.state.addNewTask('Example task');

    // assert
    expect(this.state.emit).to.be.calledWith(AppStateEvents.NEW_TASK_EVENT, task);
});

test('calling toggleTaskState() should toggle `task.done` and emit `task state changed` event with the task id, prev state and new state', function() {
    const task = this.state.addNewTask('Example');

    this.state.toggleTaskState(task.id);

    expect(task.done).to.be.true;
    expect(this.state.emit).to.be.deep.calledWith(AppStateEvents.TASK_STATE_CHANGED_EVENT, {
        taskId: task.id,
        prevState: false,
        newState: true
    });

    // should return task.done to be false
    this.state.toggleTaskState(task.id);

    expect(task.done).to.be.false;
});

test('calling toggleTaskState() should call storage.updateTask', function() {
    spy(this.state.storage);
    const task = this.state.addNewTask('Example task');

    this.state.toggleTaskState(task.id);

    expect(this.state.storage.updateTask).to.be.called;
});

test('calling updateTaskContent() should set task\'s content property and emit `task content update` event', function() {
    const task = this.state.addNewTask('Example');

    this.state.updateTaskContent(task.id, 'Two words');

    expect(task.content).to.equal('Two words');
    expect(this.state.emit).to.be.deep.calledWith(AppStateEvents.TASK_CONTENT_UPDATED_EVENT, {
        taskId: task.id,
        prevContent: 'Example',
        newContent: 'Two words'
    });
});

test('calling updateTaskContent() should call storage.updateTask', function() {
    spy(this.state.storage);
    const task = this.state.addNewTask('Example task');

    this.state.updateTaskContent(task.id, 'Two words');

    expect(this.state.storage.updateTask).to.be.called;
});

test('when calling deleteTask() the task should be removed from state', function() {
    const task = this.state.addNewTask('Test');

    this.state.deleteTask(task.id);

    expect(this.state.tasks).to.not.contain(task);
});

test('when calling deleteTask(), storage.deleteTask() should be called', function() {
    spy(this.state.storage);
    const task = this.state.addNewTask('Test');

    this.state.deleteTask(task.id);

    expect(this.state.storage.deleteTask).to.be.calledWith(task.id);
});

test('when calling deleteTask(), `tasks deleted` event should be emitted', function() {
    const task = this.state.addNewTask('Test');

    this.state.deleteTask(task.id);

    expect(this.state.emit).to.be.deep.calledWith(AppStateEvents.TASKS_DELETED_EVENT, [
        task.id
    ]);
});

test('calling clearAllFinishedTasks() should remove all finished tasks', function() {
    this.state.addNewTask('First task');
    const toBeClearedTask = this.state.addNewTask('Second task');
    this.state.toggleTaskState(toBeClearedTask.id);
    this.state.addNewTask('Third task');
    this.state.clearAllFinishedTasks();

    expect(this.state.tasks)
        .to.have.lengthOf(2)
        .and
        .to.not.deep.include(toBeClearedTask.toJSON());
});

test('calling clearAllFinishedTasks() should call storage.clearAllFinishedTasks()', function() {
    spy(this.state.storage);
    this.state.addNewTask('First task');
    this.state.addNewTask('Second task');
    this.state.addNewTask('Third task');
    this.state.clearAllFinishedTasks();

    expect(this.state.storage.clearAllFinishedTasks).to.be.called;
});

test('calling clearAllFinishedTasks() should emit `tasks deleted` event', function() {
    this.state.addNewTask('First task');
    this.state.addNewTask('Second task');
    this.state.addNewTask('Third task');
    this.state.clearAllFinishedTasks();

    expect(this.state.emit).to.be.deep.calledWith(AppStateEvents.TASKS_DELETED_EVENT);
});
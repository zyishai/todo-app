import { expect } from 'chai';
import { createStubInstance, stub, spy } from 'sinon';
import { AppState } from '../src/js/state';
import { Main } from '../src/js/main';
import { LocalStorageWrapper } from '../src/js/storage';

setup(function() {
    const MainStub = createStubInstance(Main);
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
    this.state = new AppState(new LocalStorageWrapper(), MainStub);
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

test('calling addNewTask() should call renderer.updateView()', function() {
    // act
    const task = this.state.addNewTask('Example task');

    // assert
    expect(this.state.renderer.updateView).to.be.calledWith(task);
});

test('calling toggleTaskState() should toggle `task.done` and call renderer.updateView with the task', function() {
    const task = this.state.addNewTask('Example');

    this.state.toggleTaskState(task.id);

    expect(task.done).to.be.true;
    expect(this.state.renderer.updateView).to.be.calledWith(task);

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

test('calling updateTaskContent() should set task\'s content property and call renderer.updateView', function() {
    const task = this.state.addNewTask('Example');

    this.state.updateTaskContent(task.id, 'Two words');

    expect(task.content).to.equal('Two words');
    expect(this.state.renderer.updateView).to.be.called;
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

test('when calling deletTask(), renderer.updateView() should be called', function() {
    const task = this.state.addNewTask('Test');

    this.state.deleteTask(task.id);

    expect(this.state.renderer.updateView).to.be.calledWith(task.id);
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

test('calling clearAllFinishedTasks() should call renderer.updateView()', function() {
    this.state.addNewTask('First task');
    this.state.addNewTask('Second task');
    this.state.addNewTask('Third task');
    this.state.clearAllFinishedTasks();

    expect(this.state.renderer.updateView).to.be.called;
});
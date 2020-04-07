import { expect } from 'chai';
import { createStubInstance, stub } from 'sinon';
import { AppState } from '../src/js/state';
import { Main } from '../src/js/main';
import { LocalStorageWrapper } from '../src/js/storage';

setup(function() {
    const MainStub = createStubInstance(Main);
    const LocalStorageStub = createStubInstance(LocalStorageWrapper, {
        fetchAllTasks: stub().returns([])
    });
    this.state = new AppState(MainStub, LocalStorageStub);
});

// DEBT!
test('initial state should come from `storage`', function() {
    expect(this.state.storage.fetchAllTasks).to.be.called;
});

test('calling addNewTask() should save the task in the state', function() {
    this.state.addNewTask('Example task');

    expect(this.state.tasks).to.be.lengthOf(1);
});

test('calling addNewTask() should call storage.persistTask()', function() {
    this.state.addNewTask('Example task');

    expect(this.state.storage.persistTask).to.be.called;
});

test('calling addNewTask() should call renderer.displayTask()', function() {
    // act
    const task = this.state.addNewTask('Example task');

    // assert
    expect(this.state.renderer.displayTask).to.be.calledWith(task);
});

test('calling toggleTaskState() should toggle `task.done` and call renderer.updateTask with the task', function() {
    const task = this.state.addNewTask('Example');

    this.state.toggleTaskState(task.id);

    expect(task.done).to.be.true;
    expect(this.state.renderer.updateTask).to.be.calledWith(task);

    // should return task.done to be false
    this.state.toggleTaskState(task.id);

    expect(task.done).to.be.false;
});

test('calling toggleTaskState() should call storage.updateTask', function() {
    const task = this.state.addNewTask('Example task');

    this.state.toggleTaskState(task.id);

    expect(this.state.storage.updateTask).to.be.called;
});

test('calling updateTaskContent() should set task\'s content property and call renderer.updateTak', function() {
    const task = this.state.addNewTask('Example');

    this.state.updateTaskContent(task.id, 'Two words');

    expect(task.content).to.equal('Two words');
    expect(this.state.renderer.updateTask).to.be.called;
});

test('calling updateTaskContent() should call storage.updateTask', function() {
    const task = this.state.addNewTask('Example task');

    this.state.updateTaskContent(task.id, 'Two words');

    expect(this.state.storage.updateTask).to.be.called;
});
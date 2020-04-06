import { expect } from 'chai';
import { spy, createStubInstance } from 'sinon';
import { AppState } from '../src/js/state';
import { Main } from '../src/js/main';

setup(function() {
    const MainStub = createStubInstance(Main);
    this.state = new AppState(MainStub);
});


test('calling addNewTask() should save the task in the state', function() {
    this.state.addNewTask('Example task');

    expect(this.state.tasks).to.be.lengthOf(1);
});

test('calling addNewTask() should call renderer.displayTask()', function() {
    // act
    const task = this.state.addNewTask('Example task');

    // assert
    expect(this.state.renderer.displayTask).to.be.calledWith(task);
});

test('calling finishTask() should set `task.done` to true and call renderer.updateTask with the task', function() {
    const task = this.state.addNewTask('Example');

    this.state.finishTask(task.id);

    expect(task.done).to.be.true;
    expect(this.state.renderer.updateTask).to.be.calledWith(task);
});
import { expect } from 'chai';
import { spy, createStubInstance } from 'sinon';
import { AppState } from '../src/js/app-state';
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
    this.state.addNewTask('Example task');

    // assert
    expect(this.state.renderer.displayTask).to.be.calledWith('Example task');
});
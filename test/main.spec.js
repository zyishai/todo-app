import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { spy } from 'sinon';
import { resolve } from 'path';
import { Main } from '../src/js/main';

setup(async function() {
    const dom = await JSDOM.fromFile(resolve(__dirname, '../src/index.html'));
    globalThis.document = dom.window.document;
    this.main = new Main();
});

test('when clicking the createNewTaskButton eventually displayTask() is called', function() {
    spy(this.main);

    this.main.createNewTaskButton.click();

    expect(this.main.displayTask).is.calledOnce;
});

test('when clicking the createNewTaskButton new item appended to taskList', function() {
    expect(this.main.tasksList.children).to.have.lengthOf(0);

    this.main.createNewTaskButton.click();

    expect(this.main.tasksList.children).to.have.lengthOf(1);
});

test('when clicking the status label of and item, state.finishTask() should be called', function() {
    spy(this.main.state);

    this.main.createNewTaskButton.click();

    document.querySelector('li label').click();

    expect(this.main.state.finishTask).to.be.called;
});
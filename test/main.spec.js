import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { spy } from 'sinon';
import { resolve } from 'path';
import { Main } from '../src/js/main';

setup(async function() {
    const dom = await JSDOM.fromFile(resolve(__dirname, '../src/index.html'));
    globalThis.document = dom.window.document;
    globalThis.MouseEvent = dom.window.MouseEvent;
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

test('when clicking the status label of an item, state.toggleTaskState() should be called', function() {
    spy(this.main.state);

    this.main.createNewTaskButton.click();

    document.querySelector('li label').click();

    expect(this.main.state.toggleTaskState).to.be.called;
});

test('when double clicking on the item\'s text, the edit input should have class `active` and editMode() should be called', function() {
    spy(this.main);

    this.main.createNewTaskButton.click();

    document.querySelector('li .text span').dispatchEvent(new MouseEvent('dblclick'));

    expect(this.main.editMode).to.be.called;
    expect(document.querySelector('li .text input')).to.have.property('className').include('active');
});

test('when double clicking on the item\'s edit input, the edit input should not have class `active` and displayMode() should be called', function() {
    spy(this.main);

    this.main.createNewTaskButton.click();

    document.querySelector('li .text span').dispatchEvent(new MouseEvent('dblclick'));
    document.querySelector('li .text input').dispatchEvent(new MouseEvent('dblclick'));

    expect(this.main.displayMode).to.be.called;
    expect(document.querySelector('li .text input')).property('className').not.include('active');
});

test('when double clicking on the item\'s edit input, state.updateTaskContent() should be called', function() {
    spy(this.main.state);

    this.main.createNewTaskButton.click();

    document.querySelector('li .text span').dispatchEvent(new MouseEvent('dblclick'));
    document.querySelector('li .text input').dispatchEvent(new MouseEvent('dblclick'));

    expect(this.main.state.updateTaskContent).to.be.called;
});

test('when clicking the status label of an item while on "edit mode", displayMode() should be called', function() {
    spy(this.main);

    this.main.createNewTaskButton.click();

    document.querySelector('li .text span').dispatchEvent(new MouseEvent('dblclick'));
    document.querySelector('li label').click();

    expect(this.main.displayMode).to.be.called;
});

test('after form is submitted, the form\'s input is cleared', function() {
    this.main.newTaskInput.value = 'Example task';
    this.main.createNewTaskButton.click();

    expect(this.main.newTaskInput.value).to.be.empty;
});
import { expect } from 'chai';
import { Task } from '../src/js/task';

test('when creating an empty task, the `id` field should not be empty (random)', () => {
    const task = new Task();
    
    expect(task.id).to.not.be.null;
    expect(task.id).to.not.be.undefined;
});

test('when creating a task, the `done` field should be initialized to false', () => {
    const task = new Task();

    expect(task.done).to.be.eq(false);
});

test('when creating a task with one argument, the `content` field should be initialized to that value', () => {
    const task = new Task('Hello world');

    expect(task.content).to.be.equal('Hello world');
})

test('when creating a task with two arguments, the `id` field should initialize to the first value', () => {
    const task = new Task('0', 'Hello world');

    expect(task.id).to.be.equal('0');
    expect(task.content).to.be.equal('Hello world');
});

test('when creating a task with three arguments, the `done` field should be initialized to the third argument', () => {
    const task = new Task('0', 'Hello world', true);

    expect(task.done).to.be.true;
});

test('calling toggleState() should toggle the `done` field value', () => {
    const task = new Task();
    
    task.toggleState();
    expect(task.done).to.be.true;

    task.toggleState();
    expect(task.done).to.be.false;
});

test('calling setContent() should set the `content` field', () => {
    const task = new Task();

    expect(task.content).to.be.undefined;

    task.setContent('Hello world');
    expect(task.content).to.be.equal('Hello world');
});
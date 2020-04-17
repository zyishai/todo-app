import { expect } from 'chai';
import { Task } from '../src/js/task';

test('when creating an empty task, the `id` field should not be empty', () => {
    const task = new Task();

    expect(task.id).to.not.be.null;
    expect(task.id).to.not.be.undefined;
});

test('when creating a task with `id`, the `id` field should initialize to that value', () => {
    const task = new Task('0', 'Hello world');

    expect(task.id).to.be.equal('0');
    expect(task.content).to.be.equal('Hello world');
})

test('when creating a task, the `done` field should be initialized to false', () => {
    const task = new Task();

    expect(task.done).to.be.eq(false);
});
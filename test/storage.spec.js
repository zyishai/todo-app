import { expect } from 'chai';
import { stub } from 'sinon';
import { LocalStorageWrapper } from "../src/js/storage"
import { Task } from '../src/js/task';

setup(function() {
    this.localStorageWrapper = new LocalStorageWrapper();
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

teardown(function() {
    localStorage.clear();
});

test('calling fetchAllTasks() should return json representation of localStorage.getItem("tasks")', function() {
    const fakeTasks = [
        {
            id: '5b302b58ad',
            content: 'Call grandma',
            done: true
        },
        {
            id: 'ef953a5217',
            content: 'Do homework 1 in ML',
            done: false
        }
    ];
    localStorage.setItem('tasks', JSON.stringify(fakeTasks));
    
    expect(this.localStorageWrapper.fetchAllTasks()).to.deep.equal(fakeTasks);
    expect(localStorage.getItem).to.be.calledWith('tasks');
});

test('calling fetchAllTasks() with no data saved in localStorage should return an empty array', function() {
    expect(this.localStorageWrapper.fetchAllTasks()).to.deep.equal([]);
});

test('calling persistTask() should save the task in localStorage', function() {
    const task = new Task('Test');
    this.localStorageWrapper.persistTask(task);
    
    expect(localStorage.setItem).to.be.called;
    expect(this.localStorageWrapper.fetchAllTasks()).to.deep.include(task.toJSON());
});

test('calling updateTask() should update the task in localStorage', function() {
    const task = new Task('Test');
    this.localStorageWrapper.persistTask(task);

    task.content = 'New content';
    this.localStorageWrapper.updateTask(task);

    expect(localStorage.setItem).to.be.calledTwice;
    expect(this.localStorageWrapper.fetchAllTasks()[0]).to.have.property('content', 'New content');
});

test('calling deleteTask() should remove the task from the localStorage', function() {
    const task = new Task('Test');
    this.localStorageWrapper.persistTask(task);

    this.localStorageWrapper.deleteTask(task.id);

    expect(this.localStorageWrapper.fetchAllTasks()).to.not.deep.include(task.toJSON());
});
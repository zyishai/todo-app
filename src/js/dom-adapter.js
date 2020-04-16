/**
 * This file have no tests, because it is using `lit-html` (for now)
 * and it is based on the DOM, so it is intended to use in browsers.
 * I tried to compile this library for use in tests but I faild.
 * Until I figure out what is the problem, I'm going to
 * implement this as a thin layer above `lit-html` so to minimize
 * the risk of errors from this layer.
 */
import { html, render } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';

class Adapter {
    static _getDOMElement(selector) {
         return document.querySelector(selector);
    }
    static _getAllDOMElements(selector) {
        return document.querySelectorAll(selector);
    }
    static _createDOMElement(fn){
        return (...args) => html`${fn(html, ...args)}`;
    }
    static addEventListener(element, event, fn, opts){
        return element.addEventListener(event, fn, opts);
    }
    static onAddNewTaskRequest(newTaskRequestHandler) {
        this.getNewTaskForm().addEventListener('submit', e => {
            e.preventDefault();
            newTaskRequestHandler();
        });
    }
    static onClearFinishedTasksRequest(clearFinishedTasksRequestHandler) {
        this.getClearFinishedTasksButton().addEventListener('click', e => {
            e.preventDefault();
            clearFinishedTasksRequestHandler();
        });
    }
    static getNewTaskForm() {
        return this._getDOMElement('.container form');
    }
    static getNewTaskInput() {
        return this._getDOMElement('.input input');
    }
    static getNewTaskInputValue() {
        return this.getNewTaskInput().value;
    }
    static getClearFinishedTasksButton() {
        return this._getDOMElement('.tasks .clear');
    }
    static getTasksList() {
        return this._getDOMElement('.tasks ul');
    }
    static getTaskInputValue(taskId) {
        return this._getDOMElement(`#${taskId} ~ .text input`).value;
    }
    static renderListToContainer(items, itemToElementStringFn, container){
        return render(html`${repeat(items, item => item.id, this._createDOMElement(itemToElementStringFn))}`, container);
    }
    static clearNewTaskInput() {
        this.getNewTaskInput().value = '';
    }
    static activateTaskDisplayMode(taskId) {
        this._getDOMElement(`#${taskId} ~ .text input`).classList.remove('active');
    }
    static activateTaskEditMode(taskId) {
        this._getDOMElement(`#${taskId} ~ .text input`).classList.add('active');
    }
}

export default Adapter;
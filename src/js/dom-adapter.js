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
import trashIcon from '../img/trash.svg';
import editIcon from '../img/edit.svg';

class Adapter {
    static _getDOMElement(selector) {
         return document.querySelector(selector);
    }
    static _getAllDOMElements(selector) {
        return document.querySelectorAll(selector);
    }
    static _renderListToContainer_NOT_IN_USE(items, itemToElementStringFn, container){
        return render(html`${repeat(items, item => item.id, this._createDOMElement(itemToElementStringFn))}`, container);
    }
    static _createDOMElement(fn){
        return (...args) => html`${fn(html, ...args)}`;
    }
    static _addEventListener(element, event, fn, opts){
        return element.addEventListener(event, fn, opts);
    }
    static _getNewTaskForm() {
        return this._getDOMElement('.container form');
    }
    static _getNewTaskInput() {
        return this._getDOMElement('.input input');
    }
    static _getClearFinishedTasksButton() {
        return this._getDOMElement('.tasks .clear');
    }
    static _getTasksList() {
        return this._getDOMElement('.tasks ul');
    }
    static _getTasksListOverlay() {
        return this._getDOMElement('.tasks .overlay');
    }
    static _getTaskActionsContainer() {
        return this._getDOMElement('.tasks .task-actions');
    }
    static _getTaskActionsList() {
        return this._getDOMElement('.tasks .task-actions ul');
    }
    static _renderTask(handlers) {
        return (task) => {
            const actions = [
                {
                    icon: trashIcon,
                    label: 'Delete task',
                    handler: () => handlers.deleteTaskRequestHandler(task)
                },
                {
                    icon: editIcon,
                    label: 'Edit task',
                    handler: () => handlers.taskContentStartEditRequestHandler(task)
                }
            ];
            return html`
                <li>
                    <input id=${task.id} type="checkbox" ?checked=${task.done} dir="auto">
                    <label for=${task.id} class="done" @click=${(e) => {
                        e.preventDefault();
                        handlers.taskStatusChangeRquestHandler(task);
                    }}></label>
                    <span class="text">
                        <span class="content" @click=${() => this._renderTaskActionsDrawer(actions)}>${task.content}</span>
                        <input type="text" class="" @dblclick=${() => handlers.taskContentEndEditRequestHandler(task)} value=${task.content}>
                    </span>
                </li>
            `;
        }
    }
    static _renderTaskActionsDrawer(actions) {
        // render actions to task actions list
        render(html`
                ${repeat(
                    actions,
                    action => action.label,
                    action => html`
                        <li @click=${() => {
                            this._closeTaskActionsDrawer();
                            action.handler()
                        }}>
                            <span class="icon">
                                <img src=${action.icon} alt="action icon">
                            </span>
                            <span class="text">${action.label}</span>
                        </li>
                    `
                )}
        `, this._getTaskActionsList());

        // activate overlay and show task actions list
        this._getTasksListOverlay().classList.add('active');
        this._getTaskActionsContainer().classList.add('active');
    }
    static _closeTaskActionsDrawer() {
        this._getTasksListOverlay().classList.remove('active');
        this._getTaskActionsContainer().classList.remove('active');
    }
    /** ===PUBLIC API=== */
    static onAddNewTaskRequest(newTaskRequestHandler) {
        this._getNewTaskForm().addEventListener('submit', e => {
            e.preventDefault();
            newTaskRequestHandler();
        });
    }
    static onClearFinishedTasksRequest(clearFinishedTasksRequestHandler) {
        this._getClearFinishedTasksButton().addEventListener('click', e => {
            e.preventDefault();
            clearFinishedTasksRequestHandler();
        });
    }
    static getNewTaskInputValue() {
        return this._getNewTaskInput().value;
    }
    static getTaskInputValue(taskId) {
        return this._getDOMElement(`#${taskId} ~ .text input`).value;
    }
    static renderTasksList(tasks, userDefinedHandlers = {}) {
        const defaultHandlers = {
            taskStatusChangeRquestHandler: () => {},
            taskContentStartEditRequestHandler: this.activateTaskEditMode.bind(this),
            taskContentEndEditRequestHandler: this.activateTaskDisplayMode.bind(this),
            deleteTaskRequestHandler: () => {}
        };
        const handlers = {
            ...defaultHandlers,
            ...userDefinedHandlers
        };
        return render(html`${repeat(
            tasks,
            task => task.id,
            this._renderTask(handlers)
        )}`, this._getTasksList());
    }
    static clearNewTaskInput() {
        this._getNewTaskInput().value = '';
    }
    static activateTaskDisplayMode(task) {
        this._getDOMElement(`#${task.id} ~ .text input`).classList.remove('active');
    }
    static activateTaskEditMode(task) {
        this._getDOMElement(`#${task.id} ~ .text input`).classList.add('active');
    }
}

// register global view listeners
Adapter._getTasksListOverlay().addEventListener('click', Adapter._closeTaskActionsDrawer.bind(Adapter));

export default Adapter;
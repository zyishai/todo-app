import { DomUtils } from './utils';

export class TaskForm {
    static _getNewTaskInput() {
        return this.getForm().querySelector('.input input');
    }
    static getForm() {
        return DomUtils._getDOMElement('.container form');
    }
    static getInputValue() {
        return this._getNewTaskInput().value;
    }
    static clearForm() {
        this._getNewTaskInput().value = '';
    }
}
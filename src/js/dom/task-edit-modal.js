import { render, html } from 'lit-html';
import { live } from 'lit-html/directives/live';
import confirmIcon from '../../img/confirm.svg';
import cancelIcon from '../../img/x.svg';
import { DomUtils } from "./utils";
import { Overlay } from './overlay';

export class TaskEditModal {
    static getModal() {
        return DomUtils._getDOMElement('.edit-task-modal');
    }
    static isOpen() {
        return this.getModal().classList.contains('active');
    }
    static getValue() {
        return this.getModal().querySelector('main textarea').value;
    }
    static createModal(task, handlers) {
        render(html`
            <header>
                <h2>Edit task</h2>
                <span class="close" @click=${() => handlers.closeWithoutSave()}></span>
            </header>
            <main>
                <textarea .value=${live(task.content)}></textarea>
            </main>
            <div class="actions">
                <button class="cancel" @click=${() => handlers.closeWithoutSave(task)}>
                    <span class="icon">
                        <img src=${cancelIcon} alt="cancel">
                    </span>
                    <span class="text">Cancel</span>
                </button>
                <button class="confirm" @click=${() => handlers.closeAndSave(task)}>
                    <span class="icon">
                        <img src=${confirmIcon} alt="confirm">
                    </span>
                    <span class="text">Confirm</span>
                </button>
            </div>
        `, this.getModal());
    }
    static open(task, handlers) {
        this.createModal(task, handlers);
        Overlay.show();
        this.getModal().classList.add('active');
    }
    static close() {
        if (this.isOpen()) {
            Overlay.hide();
            this.getModal().classList.remove('active');
        }
    }
}
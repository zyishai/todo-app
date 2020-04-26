import { render, html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { DomUtils } from './utils';
import { Overlay } from './overlay';

export class TaskActionsModal {
    static getModal() {
        return DomUtils._getDOMElement('.task-actions-modal');
    }
    static isOpen() {
        return this.getModal().classList.contains('active');
    }
    static open(actions) {
        // render actions to task actions list
        render(html`
                <header>
                    <h2>Task actions</h2>
                    <span class="close" @click=${() => this.close()}></span>
                </header>
                <div class="actions">
                    ${repeat(
                        actions,
                        action => action.label,
                        action => html`
                            <button @click=${() => {
                                this.close();
                                action.handler()
                            }}>
                                <span class="icon">
                                    <img src=${action.icon} alt="action icon">
                                </span>
                                <span class="text">${action.label}</span>
                        </button>
                        `
                    )}
                </div>
        `, this.getModal());

        // activate overlay and show task actions list
        Overlay.show();
        this.getModal().classList.add('active');
    }
    static close() {
        Overlay.hide();
        this.getModal().classList.remove('active');
    }
}
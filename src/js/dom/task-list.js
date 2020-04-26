import { html, render } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { DomUtils } from "./utils";
import trashIcon from '../../img/trash.svg';
import editIcon from '../../img/edit.svg';
import { TaskActionsModal } from './task-actions-modal';
import { TaskEditModal } from './task-edit-modal';

export class TaskList {
    static getList() {
        return DomUtils._getDOMElement('.tasks ul');
    }
    static getClearFinishedTasksButton() {
        return DomUtils._getDOMElement('.tasks .clear');
    }
    static renderList(tasks, handlers) {
        return render(html`${repeat(
            tasks,
            task => task.id,
            this.renderTask(handlers)
        )}`, this.getList());
    }
    static renderTask(handlers) {
        return (task) => {
            const actions = [
                {
                    icon: editIcon,
                    label: 'Edit task',
                    handler: () => handlers.taskContentStartEditRequestHandler(task, {
                        closeAndSave: handlers.taskContentEndEditRequestHandler
                    })
                },
                {
                    icon: trashIcon,
                    label: 'Delete task',
                    handler: () => {
                        handlers.deleteTaskRequestHandler(task)
                    }
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
                        <span class="content" @click=${
                            () => !task.done && !TaskActionsModal.isOpen() && !TaskEditModal.isOpen() && TaskActionsModal.open(actions)
                        }>${task.content}</span>
                    </span>
                </li>
            `;
        }
    }
}
import { html, render } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { DomUtils } from "./utils";
import trashIcon from '../../img/trash.svg';
import editIcon from '../../img/edit.svg';
import { TaskActionsModal } from './task-actions-modal';
import { TaskEditModal } from './task-edit-modal';
import { TaskForm } from './task-form';

export class TaskList {
    static getList() {
        return DomUtils._getDOMElement('#task-list section ul');
    }
    static getClearFinishedTasksButton() {
        return DomUtils._getDOMElement('#task-list section footer button');
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
                    <input type="checkbox" id=${task.id} ?checked=${task.done}>
                    <label for=${task.id} class="done" @click=${(e) => {
                        e.preventDefault();
                        handlers.taskStatusChangeRquestHandler(task);
                    }}></label>
                    <span class="text" @click=${
                        () => !task.done && 
                                !TaskActionsModal.isOpen() && 
                                !TaskEditModal.isOpen() && 
                                !TaskForm.isOpen() && 
                                TaskActionsModal.open(actions)
                    }>
                        ${task.content}
                    </span>
                </li>
            `;
        }
    }
}
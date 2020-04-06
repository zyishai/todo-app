import { AppState } from './state';

export class Main {
    static init() {
        return new Main();
    }

    constructor() {
        // DOM elements
        this.newTaskInput = document.querySelector('.input input');
        this.createNewTaskButton = document.querySelector('form .btn[type="submit"]');
        this.tasksList = document.querySelector('.tasks ul');
        this.createNewTaskForm = document.querySelector('.container form');

        this.state = new AppState(this);
        
        // register event listeners
        this.createNewTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.state.addNewTask(this.newTaskInput.value);
        });
    }

    displayTask(task) {
        const taskItem = document.createElement('li');
        const taskStatusLabel = document.createElement('label');
        taskStatusLabel.className = 'done';
        taskStatusLabel.htmlFor = task.id;
        taskStatusLabel.addEventListener('click', (e) => {
            e.preventDefault();
            this.displayMode(task.id);
            this.state.toggleTaskState(task.id);
        });
        const taskStatusCheckbox = document.createElement('input');
        taskStatusCheckbox.type = 'checkbox';
        taskStatusCheckbox.id = task.id;
        const taskTextContainer = document.createElement('span');
        taskTextContainer.className = 'text';
        const taskTextContent = document.createElement('span');
        taskTextContent.textContent = task.content;
        taskTextContent.addEventListener('dblclick', () => {
            this.editMode(task.id);
        });
        const taskTextInput = document.createElement('input');
        taskTextInput.type = 'text';
        taskTextInput.addEventListener('dblclick', () => {
            this.displayMode(task.id);
            this.state.updateTaskContent(task.id, taskTextInput.value);
        });

        taskTextContainer.append(
            taskTextContent,
            taskTextInput
        );
        taskItem.append(
            taskStatusCheckbox,
            taskStatusLabel,
            taskTextContainer
        );
        this.tasksList.appendChild(taskItem);
    }

    updateTask(task) {
        const taskItemCheckbox = document.querySelector(`#${task.id}`);
        taskItemCheckbox.checked = task.done;
        document.querySelector(`#${task.id} ~ .text span`).textContent = task.content;
    }

    editMode(taskId) {
        const task = this.state.getById(taskId);
        const taskTextInput = document.querySelector(`#${taskId} ~ .text input`);
        taskTextInput.classList.add('active');
        taskTextInput.value = task.content;
    }

    displayMode(taskId) {
        const taskTextInput = document.querySelector(`#${taskId} ~ .text input`);
        taskTextInput.classList.remove('active');
    }
}
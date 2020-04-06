import { AppState } from './app-state';

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
        taskItem.textContent = task;

        this.tasksList.appendChild(taskItem);
    }
}
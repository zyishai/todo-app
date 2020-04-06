import { Task } from "./task";

export class AppState {
    constructor(renderer) {
        this.tasks = [];
        this.renderer = renderer;
    }

    addNewTask(text) {
        const task = new Task(text);
        this.tasks.push(task);

        this.renderer.displayTask(task);

        return task;
    }

    finishTask(taskId) {
        const task = this.getById(taskId)
        task.done = true;
        this.renderer.updateTask(task);
    }

    getById(id) {
        return this.tasks.find(task => task.id === id);
    }
}
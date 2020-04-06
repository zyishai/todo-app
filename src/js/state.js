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

    toggleTaskState(taskId) {
        const task = this.getById(taskId)
        task.done = !task.done;
        this.renderer.updateTask(task);
    }

    getById(id) {
        return this.tasks.find(task => task.id === id);
    }

    updateTaskContent(taskId, text) {
        const task = this.getById(taskId);
        task.content = text;
        this.renderer.updateTask(task);
    }
}
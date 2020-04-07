import { Task } from "./task";

export class AppState {
    constructor(renderer, storage) {
        this.tasks = storage.fetchAllTasks();
        this.renderer = renderer;
        this.storage = storage;
    }

    addNewTask(text) {
        const task = new Task(text);
        this.tasks.push(task);
        if (this.storage) {
            this.storage.persistTask(task);
        }
        this.renderer.displayTask(task);

        return task;
    }

    toggleTaskState(taskId) {
        const task = this.getById(taskId)
        task.done = !task.done;
        if (this.storage) {
            this.storage.updateTask(task);
        }
        this.renderer.updateTask(task);
    }

    getById(id) {
        return this.tasks.find(task => task.id === id);
    }

    updateTaskContent(taskId, text) {
        const task = this.getById(taskId);
        task.content = text;
        if (this.storage) {
            this.storage.updateTask(task);
        }
        this.renderer.updateTask(task);
    }

    deleteTask(taskId) {
        this.storage.deleteTask(taskId);
        this.tasks = this.storage.fetchAllTasks();
        this.renderer.removeTask(taskId);
    }
}
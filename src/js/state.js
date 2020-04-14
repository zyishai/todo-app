import { Task } from "./task";

export class AppState {
    constructor(storage, renderer) {
        if (storage) {
            this.storage = storage;
        }
        if (renderer) {
            this.renderer = renderer;
        }

        this.tasks = this.storage ? storage.fetchAllTasks() : [];
    }

    setRenderer(renderer) {
        this.renderer = renderer;
    }

    setStorage(storage) {
        this.storage = storage;
    }

    addNewTask(text) {
        const task = new Task(text);
        this.tasks.push(task);
        if (this.storage) {
            this.storage.persistTask(task);
        }
        if (this.renderer) {
            this.renderer.updateView(task);
        }

        return task;
    }

    toggleTaskState(taskId) {
        const task = this.getById(taskId)
        task.done = !task.done;
        if (this.storage) {
            this.storage.updateTask(task);
        }
        if (this.renderer) {
            this.renderer.updateView(task);
        }
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
        if (this.renderer) {
            this.renderer.updateView(task);
        }
    }

    deleteTask(taskId) {
        if (this.storage) {
            this.storage.deleteTask(taskId);
            this.tasks = this.storage.fetchAllTasks();
        }
        if (this.renderer) {
            this.renderer.updateView(taskId);
        }
    }

    clearAllFinishedTasks() {
        if (this.storage) {
            this.storage.clearAllFinishedTasks();
            this.tasks = this.storage.fetchAllTasks();
        }
        if (this.renderer) {
            this.renderer.updateView();
        }
    }
}
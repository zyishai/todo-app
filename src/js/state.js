import { EventEmitter } from 'events';
import { Task } from "./task";
import AppStateEvents from './app-state-events';

export class AppState extends EventEmitter {
    constructor(storage) {
        super();
        if (storage) {
            this.storage = storage;
        }

        this.tasks = this.storage ? storage.fetchAllTasks() : [];
    }

    newTaskEvent(newTaskEventHandler) {
        this.addListener(AppStateEvents.NEW_TASK_EVENT, newTaskEventHandler);
    }

    taskStateChangedEvent(taskStateChangedEventHandler) {
        this.addListener(AppStateEvents.TASK_STATE_CHANGED_EVENT, taskStateChangedEventHandler);
    }

    taskContentUpdatedEvent(taskContentUpdatedEventHandler) {
        this.addListener(AppStateEvents.TASK_CONTENT_UPDATED_EVENT, taskContentUpdatedEventHandler);
    }

    singleTaskDeletedEvent(singleTaskDeletedEventHandler) {
        this.addListener(AppStateEvents.TASKS_DELETED_EVENT, singleTaskDeletedEventHandler);
    }

    multipleTasksDeletedEvent(multipleTasksDeletedEventHandler) {
        this.addListener(AppStateEvents.TASKS_DELETED_EVENT, multipleTasksDeletedEventHandler);
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
        this.emit(AppStateEvents.NEW_TASK_EVENT, task);

        return task;
    }

    toggleTaskState(taskId) {
        const eventPayload = {
            taskId,
            prevState: undefined,
            newState: undefined
        }
        const task = this.getById(taskId);
        eventPayload.prevState = task.done;
        task.done = !task.done;
        eventPayload.newState = task.done;
        if (this.storage) {
            this.storage.updateTask(task);
        }
        this.emit(AppStateEvents.TASK_STATE_CHANGED_EVENT, eventPayload);
    }

    getById(id) {
        return this.tasks.find(task => task.id === id);
    }

    updateTaskContent(taskId, text) {
        const eventPayload = {
            taskId,
            prevContent: undefined,
            newContent: undefined
        }
        const task = this.getById(taskId);
        eventPayload.prevContent = task.content;
        task.content = text;
        eventPayload.newContent = task.content;
        if (this.storage) {
            this.storage.updateTask(task);
        }
        this.emit(AppStateEvents.TASK_CONTENT_UPDATED_EVENT, eventPayload);
    }

    deleteTask(taskId) {
        if (this.storage) {
            this.storage.deleteTask(taskId);
            this.tasks = this.storage.fetchAllTasks();
        }
        this.emit(AppStateEvents.TASKS_DELETED_EVENT, [taskId]);
    }

    clearAllFinishedTasks() {
        let deletedTasks = this.tasks.slice();
        if (this.storage) {
            this.storage.clearAllFinishedTasks();
            this.tasks = this.storage.fetchAllTasks();
            deletedTasks = deletedTasks.filter(task => 
                !this.tasks.find(t => t.id === task.id));
        }
        this.emit(AppStateEvents.TASKS_DELETED_EVENT, deletedTasks.map(task => task.id));
    }
}
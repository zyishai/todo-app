import { EventEmitter } from 'events';
import { Task } from "./task";
import AppStateEvents from './app-state-events';

export class AppState extends EventEmitter {
    constructor(storage) {
        super();

        this._tasks = []; // initial value
        this.storage = storage;
    }

    async _syncFromStorage() {
        this._tasks = await this.storage.fetchAllTasks()
        this.emit(AppStateEvents.TASKS_SYNC, this._tasks);
    }

    _getById(id) {
        return this.tasks.find(task => task.id === id);
    }

    get tasks() {
        return this._tasks;
    }

    onTasksSyncEvent(tasksSyncEventHandler) {
        this.addListener(AppStateEvents.TASKS_SYNC, tasksSyncEventHandler);
    }

    onNewTaskEvent(newTaskEventHandler) {
        this.addListener(AppStateEvents.NEW_TASK_ADDED_EVENT, newTaskEventHandler);
    }

    onTaskStateChangedEvent(taskStateChangedEventHandler) {
        this.addListener(AppStateEvents.TASK_STATE_CHANGED_EVENT, taskStateChangedEventHandler);
    }

    onTaskContentUpdatedEvent(taskContentUpdatedEventHandler) {
        this.addListener(AppStateEvents.TASK_CONTENT_UPDATED_EVENT, taskContentUpdatedEventHandler);
    }

    onSingleTaskDeletedEvent(singleTaskDeletedEventHandler) {
        this.addListener(AppStateEvents.TASKS_DELETED_EVENT, singleTaskDeletedEventHandler);
    }

    onMultipleTasksDeletedEvent(multipleTasksDeletedEventHandler) {
        this.addListener(AppStateEvents.TASKS_DELETED_EVENT, multipleTasksDeletedEventHandler);
    }

    async syncStorageFrom(db) {
        this.storage.connectTo(db);
        this._tasks = await this.storage.fetchAllTasks()
        this.emit(AppStateEvents.TASKS_SYNC, this._tasks);
    }

    async addNewTask(text) {
        const task = new Task(text);
        await this.storage.persistTask(task);
        this.emit(AppStateEvents.NEW_TASK_ADDED_EVENT, task);
        await this._syncFromStorage();

        return task;
    }

    async toggleTaskState(taskId) {
        const eventPayload = {
            taskId,
            prevState: undefined,
            newState: undefined
        }
        const task = this._getById(taskId);
        eventPayload.prevState = task.done;
        task.toggleState();
        eventPayload.newState = task.done;
        await this.storage.updateTask(task);
        this.emit(AppStateEvents.TASK_STATE_CHANGED_EVENT, eventPayload);
        await this._syncFromStorage();
    }

    async updateTaskContent(taskId, text) {
        const eventPayload = {
            taskId,
            prevContent: undefined,
            newContent: undefined
        }
        const task = this._getById(taskId);
        eventPayload.prevContent = task.content;
        task.setContent(text);
        eventPayload.newContent = task.content;
        await this.storage.updateTask(task);
        this.emit(AppStateEvents.TASK_CONTENT_UPDATED_EVENT, eventPayload);
        await this._syncFromStorage();
    }

    async deleteTask(taskId) {
        await this.storage.deleteTask(taskId);
        this.emit(AppStateEvents.TASKS_DELETED_EVENT, [taskId]);
        await this._syncFromStorage();
    }

    async clearAllFinishedTasks() {
        let deletedTasks = this.tasks.slice();
        await this.storage.clearAllFinishedTasks();
        await this._syncFromStorage();
        deletedTasks = deletedTasks.filter(task => 
            !this.tasks.find(t => t.id === task.id));
        this.emit(AppStateEvents.TASKS_DELETED_EVENT, deletedTasks.map(task => task.id));
    }
}
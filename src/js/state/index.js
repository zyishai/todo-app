import {take} from 'rxjs/operators';
import {TasksStorage} from '../storage';
import {Task} from '../task';

export class State {
  /**
   * @param {TasksStorage} storage
   */
  constructor(storage) {
    this.storage = storage;
  }

  async syncStorageFrom(token) {
    this.storage.connectTo(token);
  }

  get tasks() {
    return this.storage.tasks;
  }

  async addNewTask(text) {
    const task = new Task(text);
    await this.storage.save(task);

    return task;
  }

  async toggleTaskState(id) {
    const task = Task.from(await this.storage._getById(id));
    task.toggleState();

    await this.storage.update(task);
  }

  async updateTaskContent(id, text) {
    const task = Task.from(await this.storage._getById(id));
    task.setContent(text);

    await this.storage.update(task);
  }

  async deleteTask(id) {
    const task = Task.from(await this.storage._getById(id));

    await this.storage.delete(task);
  }

  async clearAllFinishedTasks() {
    const tasks = this.storage._tasks$.value;
    const finishedTasks = tasks.filter((task) => task.done).map(Task.from);
    await this.storage.delete(...finishedTasks);
  }

  async clearAllTasks() {
    await this.storage.clearStorage();
  }
}

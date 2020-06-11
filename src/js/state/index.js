import {map} from 'rxjs/operators';
import {Storage as AppStorage} from '../storage';
import {Task} from '../task';
import {BehaviorSubject, Observable} from 'rxjs';

export class State {
  /**
   * @param {AppStorage} storage
   */
  constructor(storage) {
    this.storage = storage;
    this._selectedCategory$ = new BehaviorSubject('Default');
  }

  async syncStorageFrom(token) {
    this.storage.connectTo(token);
  }

  get tasks() {
    return this.storage.tasks.pipe(
      map((tasks) => (tasks ? tasks : [])),
      map((tasks) =>
        tasks.filter(
          (task) =>
            task.category === this._selectedCategory$.value ||
            (!task.category && this._selectedCategory$.value === 'Default'),
        ),
      ),
    );
  }

  get categories() {
    return this.storage.categories;
  }

  /**
   * @type {Observable<string>}
   */
  get selectedCategory() {
    delete this.selectedCategory;
    Object.defineProperty(this, 'selectedCategory', {
      value: this._selectedCategory$.asObservable(),
    });
    return this.selectedCategory;
  }

  // FIXME: add support for category
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

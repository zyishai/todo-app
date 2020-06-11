import {map} from 'rxjs/operators';
import {Storage as AppStorage} from '../storage';
import {Task} from '../task';
import {BehaviorSubject, Observable, combineLatest} from 'rxjs';
import {startsWith} from 'pouchdb-find';

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
    return combineLatest(this.storage.tasks, this._selectedCategory$).pipe(
      map(([tasks, _]) => (tasks ? tasks : [])),
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

  selectCategory(categoryName) {
    this._selectedCategory$.next(categoryName);
  }

  async addNewTask(text, category) {
    const task = new Task(text);
    task.setCategory(category);
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
    const sub = this.tasks.subscribe(async (tasks) => {
      const finishedTasks = tasks.filter((task) => task.done).map(Task.from);
      await this.storage.delete(...finishedTasks);
      sub.unsubscribe();
    });
  }

  async clearAllTasks() {
    await this.storage.clearStorage();
  }
}

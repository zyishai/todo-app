import {combineLatest} from 'rxjs';
import {Router} from './dom/router';
import DomAdapter from './dom/adapter';
import {State} from './state';
import {UserManager} from './user-manager';
import {Task} from './task';

export class Main {
  static init(...dependencies) {
    return new Main(...dependencies);
  }

  /**
   * @param {DomAdapter} domAdapter
   * @param {State} state
   * @param {UserManager} userManager
   */
  constructor(domAdapter, state, userManager) {
    this.domAdapter = domAdapter;
    this.state = state;
    this.userManager = userManager;
    this.router = new Router([
      {
        path: '/',
        template: () => this._outletPageRoute(),
      },
      {
        path: '/intro',
        template: () => this._introPathRoute(),
      },
      {
        path: '/home',
        template: ({token}) => this._homePathRoute(token),
      },
    ]);
    this.initializeAdapter();
    this.router.loadRoute(''); // explicit initial loading!
  }

  initializeAdapter() {
    this.domAdapter.initGlobal();
    // `login` button press
    this.domAdapter.onLoginRequest(this._loginRequestHandler.bind(this));
  }

  _homePathRoute(token) {
    this.state.syncStorageFrom(token);
    this.domAdapter.renderTasksPage();

    // `new task` form submission -> add new task
    this.domAdapter.onAddNewTaskRequest(
      this._addNewTaskRequestHandler.bind(this),
    );

    // `clear all finished tasks` button press
    this.domAdapter.onClearFinishedTasksRequest(
      this._clearFinishedTasksRequestHandler.bind(this),
    );

    combineLatest(
      this.state.tasks,
      this.state.categories,
      this.state.selectedCategory,
    ).subscribe(([tasks, categories, selectedCategory]) => {
      const taskObjs = tasks.map(Task.from);
      const categoryObjs = Array.from(categories, (category) => ({
        name: category,
        displayName: category,
        selected: category === selectedCategory ? true : false,
      })).sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      this.domAdapter.setFormCategoriesChoices(categoryObjs);
      this.updateView(taskObjs, categoryObjs);
    });
  }

  _addNewTaskRequestHandler(newTaskTitle, newTaskCategory) {
    this.state.addNewTask(newTaskTitle, newTaskCategory);
  }

  _clearFinishedTasksRequestHandler() {
    this.state.clearAllFinishedTasks();
  }

  async _loginRequestHandler(loginData) {
    const userToken = this.userManager.login(loginData);
    this.router.loadRoute('home', {token: userToken});
  }

  _outletPageRoute() {
    const savedToken = this.userManager.getUserToken();

    if (savedToken) {
      this.router.loadRoute('home', {token: savedToken});
    } else {
      this.router.loadRoute('intro');
    }
  }
  _introPathRoute() {
    this.domAdapter.renderIntroPage();
  }

  _toggleTaskState(task) {
    this.domAdapter.activateTaskDisplayMode();
    this.state.toggleTaskState(task.id);
  }

  _updateTaskContent(task) {
    this.domAdapter.activateTaskDisplayMode();
    this.state.updateTaskContent(task.id, this.domAdapter.getTaskInputValue());
  }

  _deleteTask(task) {
    this.state.deleteTask(task.id);
  }

  _selectCategory(categoryName) {
    this.state.selectCategory(categoryName);
  }

  _deleteCategory(categoryName) {
    this.state.deleteCategory(categoryName);
  }

  updateView(tasks, categories) {
    this.domAdapter.renderTasksList(tasks, {
      taskStatusChangeRquestHandler: this._toggleTaskState.bind(this),
      taskContentEndEditRequestHandler: this._updateTaskContent.bind(this),
      deleteTaskRequestHandler: this._deleteTask.bind(this),
    });
    this.domAdapter.renderCategoriesList(categories, {
      categorySelectedHandler: this._selectCategory.bind(this),
      categoryDeleteRequestHandler: this._deleteCategory.bind(this),
    });
  }
}

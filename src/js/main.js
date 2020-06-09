import {Router} from './dom/router';
export class Main {
  static init(...dependencies) {
    return new Main(...dependencies);
  }

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
    this.domAdapter.renderTasksPage();

    // `new task` form submission -> add new task
    this.domAdapter.onAddNewTaskRequest(
      this._addNewTaskRequestHandler.bind(this),
    );

    // `clear all finished tasks` button press
    this.domAdapter.onClearFinishedTasksRequest(
      this._clearFinishedTasksRequestHandler.bind(this),
    );

    this.state.onTasksSyncEvent(this.updateView.bind(this));
    this.state.syncStorageFrom(token);
  }

  _addNewTaskRequestHandler(newTask) {
    this.state.addNewTask(newTask);
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

  updateView() {
    this.domAdapter.renderTasksList(this.state.tasks, {
      taskStatusChangeRquestHandler: this._toggleTaskState.bind(this),
      taskContentEndEditRequestHandler: this._updateTaskContent.bind(this),
      deleteTaskRequestHandler: this._deleteTask.bind(this),
    });
  }
}

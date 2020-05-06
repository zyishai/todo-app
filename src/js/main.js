export class Main {
    static init(domAdapter, state, userManager) {
        return new Main(domAdapter, state, userManager);
    }

    constructor(domAdapter, state, userManager) {
        this.domAdapter = domAdapter;
        this.state = state;
        this.userManager = userManager;

        this.registerGlobalListeners();
    }

    _performLogin(token) {
        this.domAdapter.initializeTasksPage();

        // `new task` form submittion -> add new task
        this.domAdapter.onAddNewTaskRequest(
            this._addNewTaskRequestHandler.bind(this)
        );
        
        // `clear all finished tasks` button press
        this.domAdapter.onClearFinishedTasksRequest(
            this._clearFinishedTasksRequestHandler.bind(this)
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
        this._performLogin(userToken);
    }

    registerGlobalListeners() {
        // We need to keep this event if we perform login,
        // because we let the user re-login, and the intro page
        // initialize the login modal... need redesign!
        this.domAdapter.initializeIntroPage();

        // `login` button press
        this.domAdapter.onLoginRequest(
            this._loginRequestHandler.bind(this)
        );

        const savedToken = this.userManager.getUserToken();

        if (savedToken) {
            this._performLogin(savedToken);
        }
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
        this.domAdapter.renderTasksList(
            this.state.tasks,
            {
                taskStatusChangeRquestHandler: this._toggleTaskState.bind(this),
                taskContentEndEditRequestHandler: this._updateTaskContent.bind(this),
                deleteTaskRequestHandler: this._deleteTask.bind(this)
            }
        );
    }
}
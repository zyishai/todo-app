export class Main {
    static init(domAdapter, state) {
        return new Main(domAdapter, state);
    }

    constructor(domAdapter, state) {
        this.domAdapter = domAdapter;
        this.state = state;

        this.registerGlobalListeners();
    }

    _addNewTaskRequestHandler(newTask) {
        this.state.addNewTask(newTask);
    }

    _clearFinishedTasksRequestHandler() {
        this.state.clearAllFinishedTasks();
    }

    _loginRequestHandler() {
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
        this.state.initialStorageSync();
    }

    registerGlobalListeners() {
        this.domAdapter.initializeIntroPage();

        // `login` button press
        this.domAdapter.onLoginRequest(
            this._loginRequestHandler.bind(this)
        );
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
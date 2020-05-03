export class Main {
    static init(domAdapter, state) {
        return new Main(domAdapter, state);
    }

    constructor(domAdapter, state) {
        this.domAdapter = domAdapter;
        this.state = state;

        this.registerGlobalListeners();
        this.updateView();
    }

    _addNewTaskRequestHandler(newTask) {
        this.state.addNewTask(newTask);
    }

    _clearFinishedTasksRequestHandler() {
        this.state.clearAllFinishedTasks();
    }

    registerGlobalListeners() {
        this.domAdapter.initialize();
        
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

    _toggleTaskState(task) {
        this.domAdapter.activateTaskDisplayMode(task);
        this.state.toggleTaskState(task.id);
    }

    _updateTaskContent(task) {
        this.domAdapter.activateTaskDisplayMode(task);
        this.state.updateTaskContent(task.id, this.domAdapter.getTaskInputValue(task.id));
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
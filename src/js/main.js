export class Main {
    static init(domAdapter, state) {
        return new Main(domAdapter, state);
    }

    constructor(domAdapter, state) {
        this.domAdapter = domAdapter;
        this.state = state;
        this.state.setRenderer(this);

        this.registerGlobalListeners();
        this.updateView();
    }

    _addNewTaskRequestHandler() {
        this.state.addNewTask(this.domAdapter.getNewTaskInputValue());
        this.domAdapter.clearNewTaskInput();
    }

    _clearFinishedTasksRequestHandler() {
        this.state.clearAllFinishedTasks();
    }

    registerGlobalListeners() {
        // `new task` form submittion -> add new task
        this.domAdapter.onAddNewTaskRequest(
            this._addNewTaskRequestHandler.bind(this)
        );
        
        // `clear all finished tasks` button press
        this.domAdapter.onClearFinishedTasksRequest(
            this._clearFinishedTasksRequestHandler.bind(this)
        );
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
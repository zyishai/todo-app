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

    _newTaskFormSubmitEventHandler(e) {
        e.preventDefault();
        this.state.addNewTask(this.domAdapter.getNewTaskInputValue());
        this.domAdapter.clearNewTaskInput();
    }

    _clearFinishedTasksButtonClickEventHandler() {
        this.state.clearAllFinishedTasks();
    }

    registerGlobalListeners() {
        // `new task` form submittion -> add new task
        this.domAdapter.addEventListener(
            this.domAdapter.getNewTaskForm(),
            'submit',
            this._newTaskFormSubmitEventHandler.bind(this)
        );
        
        // `clear all finished tasks` button press
        this.domAdapter.addEventListener(
            this.domAdapter.getClearFinishedTasksButton(),
            'click',
            this._clearFinishedTasksButtonClickEventHandler.bind(this)
        );
    }

    _toggleTaskState(taskId) {
        return (e) => {
            e.preventDefault();
            this.domAdapter.activateTaskDisplayMode(taskId);
            this.state.toggleTaskState(taskId);
        }
    }

    _updateTaskContent(taskId) {
        this.domAdapter.activateTaskDisplayMode(taskId);
        this.state.updateTaskContent(taskId, this.domAdapter.getTaskInputValue(taskId));
    }

    _taskToDOMString(templateRenderer, task) {
        return templateRenderer`
            <li>
                <input id=${task.id} type="checkbox" ?checked=${task.done} dir="auto">
                <label for=${task.id} class="done" @click=${this._toggleTaskState(task.id)}></label>
                <span class="text">
                    <span class="content" @dblclick=${() => this.domAdapter.activateTaskEditMode(task.id)}>${task.content}</span>
                    <span class="delete" @click=${() => this.state.deleteTask(task.id)}>&#128465;</span>
                    <input type="text" class="" @dblclick=${() => this._updateTaskContent(task.id)} value=${task.content}>
                </span>
            </li>
        `;
    }

    updateView() {
        this.domAdapter.renderListToContainer(
            this.state.tasks, 
            this._taskToDOMString.bind(this),
            this.domAdapter.getTasksList()
        );
    }
}
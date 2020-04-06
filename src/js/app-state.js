export class AppState {
    constructor(renderer) {
        this.tasks = [];
        this.renderer = renderer;
    }

    addNewTask(text) {
        this.tasks.push(text);

        this.renderer.displayTask(text);
    }
}
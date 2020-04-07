export class LocalStorageWrapper {
    persistTask(task) {
        const allTasks = this.fetchAllTasks();
        allTasks.push(task.toJSON());
        localStorage.setItem('tasks', JSON.stringify(allTasks));
    }

    updateTask(task) {
        const tasks = this.fetchAllTasks().map(t => t.id === task.id ? task.toJSON() : t);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    fetchAllTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    }
}
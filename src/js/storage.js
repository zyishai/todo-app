export class LocalStorageWrapper {
    persistTask(task) {
        const allTasks = this.fetchAllTasks();
        allTasks.push(task.toJSON());
        localStorage.setItem('tasks', JSON.stringify(allTasks));
    }

    updateTask(task) {
        const tasks = this.fetchAllTasks().map(t => t.id === task.id ? task : t);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    fetchAllTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    }

    deleteTask(taskId) {
        let tasks = this.fetchAllTasks().filter(t => t.id !== taskId);

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    clearAllFinishedTasks() {
        console.log(this.fetchAllTasks());
        const tasks = this.fetchAllTasks().filter(task => !task.done);
        console.log(tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}
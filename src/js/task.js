import { randomBytes } from 'crypto';

export class Task {
    constructor(text) {
        this.content = text;
        this.done = false;
        this.generateId();
    }

    generateId() {
        this.id = 'task-' + randomBytes(6).toString('hex');
    }
}
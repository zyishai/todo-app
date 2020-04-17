import { randomBytes } from 'crypto';

export class Task {
    constructor() {
        if (arguments.length >= 3) {
            this.id = String(arguments[0]);
            this.content = String(arguments[1]);
            this.done = Boolean(arguments[2]);
        } else if (arguments.length === 2) { // Task('abcd', 'some message')
            this.id = String(arguments[0]);
            this.content = String(arguments[1]);
            this.done = false;
        } else if (arguments.length === 1) { // Task('Hi')
            this.content = String(arguments[0]);
            this.id = this.generateId();
            this.done = false;
        } else {
            this.id = this.generateId(); // Task()
            this.done = false;
        }
    }

    generateId() {
        return 'task-' + randomBytes(6).toString('hex');
    }

    toJSON() {
        return {
            id: this.id,
            content: this.content,
            done: this.done
        }
    }
}
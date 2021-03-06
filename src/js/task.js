import {randomBytes} from 'crypto';

export class Task {
  static empty = null;

  static from({id, content, done, category}) {
    const t = new Task(id, content, done);
    t.setCategory(category || 'Default');
    return t;
  }

  constructor(...args) {
    if (args.length >= 3) {
      this.id = String(args[0]);
      this.content = String(args[1]);
      this.done = Boolean(args[2]);
    } else if (args.length === 2) {
      // Task('abcd', 'some message')
      this.id = String(args[0]);
      this.content = String(args[1]);
      this.done = false;
    } else if (args.length === 1) {
      // Task('Hi')
      this.content = String(args[0]);
      this.id = this._generateId();
      this.done = false;
    } else {
      this.id = this._generateId(); // Task()
      this.done = false;
    }

    this.category = 'Default';
  }

  _generateId() {
    return 'task-' + randomBytes(6).toString('hex');
  }

  toggleState() {
    this.done = !this.done;
  }

  setContent(text) {
    this.content = text;
  }

  setCategory(cat) {
    this.category = cat;
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      done: this.done,
      category: this.category,
    };
  }
}

import { createHash } from 'crypto';

const credentialsKey = 'todo-credentials';

export class User {
    token;

    constructor(localstorage) {
        this.ls = localstorage;
    }

    login(opts = {}) {
        const { username, password, persist } = opts;

        if (!username || !password) {
            throw new Error('Missing username or password');
        }

        const hash = createHash('sha1');
        this.token = hash.update(`${username}:${password}`).digest('hex');

        if (persist && this.ls) {
            this.ls.setItem(credentialsKey, hash);
        } else if (this.ls) {
            this.ls.removeItem(credentialsKey);
        }

        return this.token;
    }

    getUserToken() {
        if (!this.token) {
            return this.ls.getItem(credentialsKey);
        }
        
        return this.token;
    }
}
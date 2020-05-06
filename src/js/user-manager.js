import { createHash } from 'crypto';

const credentialsKey = 'todo-credentials';

export class UserManager {
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
            this.ls.setItem(credentialsKey, JSON.stringify({token: this.token}));
        } else if (this.ls) {
            this.ls.removeItem(credentialsKey);
        }

        return this.token;
    }

    getUserToken() {
        if (!this.token) {
            const credentials = JSON.parse(this.ls.getItem(credentialsKey));

            return credentials && credentials.token;
        }
        
        return this.token;
    }
}
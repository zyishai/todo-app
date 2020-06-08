export class UrlBuilder {
    constructor() {
        this.username = process.env.REMOTE_STORAGE_USERNAME;
        this.password = process.env.REMOTE_STORAGE_PASSWORD;
        this.host = process.env.REMOTE_STORAGE_URL_HOST;
        this.databaseName = process.env.STORAGE_DB_NAME || 'default';
    }

    setUser(username) {
        this.username = username;
        return this;
    }

    setPassword(password) {
        this.password = password;
        return this;
    }

    setHostName(host) {
        this.host = host;
        return this;
    }

    setDatabaseName(dbName) {
        this.databaseName = dbName;
        return this;
    }

    getLocalUrl() {
        return this.databaseName;
    }

    getRemoteUrl() {
        if (!this.host) {
            return null;
        }

        return this.username && this.password
            ? `http://${this.username}:${this.password}@${this.host}/${this.databaseName}`
            : `http://${this.host}/${this.databaseName}`;
    }

    getUrl() {
        return this.host 
            ? this.username && this.password
                ? `http://${this.username}:${this.password}@${this.host}/${this.databaseName}`
                : `http://${this.host}/${this.databaseName}`
            : this.databaseName;
    }
}
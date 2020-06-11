export class UrlBuilder {
  constructor() {
    this.username = null;
    this.password = null;
    this.host = null;
    this.databaseName = null;
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

  getUrl() {
    return this.host
      ? this.username && this.password
        ? `http://${this.username}:${this.password}@${this.host}/${this.databaseName}`
        : `http://${this.host}/${this.databaseName}`
      : this.databaseName;
  }
}

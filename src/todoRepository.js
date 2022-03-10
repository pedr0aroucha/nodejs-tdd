// @ts-check

const loki = require('lokijs');

class TodoRepository {
  constructor() {
    const db = new loki('todo', {});
    this.schedule = db.addCollection('schedule');
  }

  list() {}

  create(data) {}
}

module.exports = TodoRepository;

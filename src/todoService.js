class TodoService {
  constructor({ todoRepository }) {
    this.todoRepository = todoRepository;
  }

  create(data) {
    return this.todoRepository.create(data);
  }

  list() {
    return this.todoRepository.list();
  }
}

module.exports = TodoService;

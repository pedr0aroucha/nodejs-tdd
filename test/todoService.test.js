const { describe, it, before, afterEach } = require('mocha');
const { expect } = require('chai');
const TodoService = require('../src/todoService');
const { createSandbox } = require('sinon');

describe('TodoService', () => {
  let sandbox;

  before(() => {
    sandbox = createSandbox();
  });

  describe('#list', () => {
    const mockDatabase = [
      {
        name: 'pedro',
        age: '19',
        meta: { revision: 0, created: 1646953428794, version: 0 },
        $loki: 1,
      },
    ];

    let todoService;
    beforeEach(() => {
      const dependencies = {
        todoRepository: {
          list: sandbox.stub().returns(mockDatabase),
        },
      };

      todoService = new TodoService(dependencies);
    });

    it('', () => {});
  });
});

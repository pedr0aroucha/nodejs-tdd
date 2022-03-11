// @ts-check

const { describe, it, before, afterEach } = require('mocha');
const { expect } = require('chai');
const TodoService = require('../src/todoService');
const Todo = require('../src/todo');
const { createSandbox } = require('sinon');

describe('TodoService', () => {
	let sandbox;
	before(() => (sandbox = createSandbox()));

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

		it('should return data on specific format', () => {
			const result = todoService.list();
			const [{ meta, $loki, ...expected }] = mockDatabase;
			expect(result).to.be.deep.equal([expected]);
		});
	});

	describe('#create', () => {
		let todoService;
		beforeEach(() => {
			const dependencies = {
				todoRepository: {
					create: sandbox.stub().returns(true),
				},
			};

			todoService = new TodoService(dependencies);
		});
		afterEach(() => sandbox.restore());

		it("shouldn't save todo item with invalid data", () => {
			const data = new Todo({
				text: '',
				when: '',
			});

			Reflect.deleteProperty(data, 'id');

			const expected = {
				error: {
					message: 'invalid data',
					data,
				},
			};
			const result = todoService.create(data);
			expect(result).to.be.deep.equal(expected);
		});
		it('should save todo item with late status when the property is further than today', () => {
			const properties = {
				text: 'I must walk my dog',
				when: new Date('2020-12-01 12:00:00 GMT-0'),
			};
			const expectedId = '000001';

			const uuid = require('uuid');
			const fakeUUID = sandbox.fake.returns(expectedId);
			sandbox.replace(uuid, 'v4', fakeUUID);

			const data = new Todo(properties);

			const today = new Date('2021-12-02 12:00:00 GMT-0');
			sandbox.useFakeTimers(today.getTime());

			todoService.create(data);

			const expectedCallWith = {
				...data,
				status: 'late',
			};

			expect(
				todoService.todoRepository.create.calledOnceWithExactly(
					expectedCallWith
				)
			).to.be.ok;
		});
		it("should't save todo item with pending status", () => {
			const properties = {
				text: 'I must walk my dog',
				when: new Date('2022-12-01 12:00:00 GMT-0'),
			};
			const expectedId = '000001';

			const uuid = require('uuid');
			const fakeUUID = sandbox.fake.returns(expectedId);
			sandbox.replace(uuid, 'v4', fakeUUID);

			const data = new Todo(properties);

			const today = new Date('2021-12-02 12:00:00 GMT-0');
			sandbox.useFakeTimers(today.getTime());

			todoService.create(data);

			const expectedCallWith = {
				...data,
				status: 'pending',
			};

			expect(
				todoService.todoRepository.create.calledOnceWithExactly(
					expectedCallWith
				)
			).to.be.ok;
		});
	});
});

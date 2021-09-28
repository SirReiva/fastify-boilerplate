import { TodoModel } from './todo.model';

export const TokenTodoRepository = Symbol('ITodoRepository');

export interface IListTodo {
	data: Array<TodoModel>;
	size: number;
}

export interface ITodoRepository {
	findById(id: string): TodoModel | null;
	list(skip: number, limit: number): IListTodo;
	create(todo: TodoModel): void;
	update(todo: TodoModel): void;
}

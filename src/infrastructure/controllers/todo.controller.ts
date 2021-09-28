import { FastifyRequest } from 'fastify';
import { inject } from 'inversify';
import uuid from 'uuid-random';
import { Controller } from '../../core/decorators/controller.decorator';
import { Get, Post } from '../../core/decorators/route.decorator';
import { NotFoundError } from '../../core/errors';
import { JWTGuard } from '../../core/middlewares/jwt.middleware';
import { TodoModel } from '../../domain/todo.model';
import {
	ITodoRepository,
	TokenTodoRepository,
} from '../../domain/todo.repository';
import { CreateTodoDTO, CreateTodoDTOType } from '../dto/create-todo.dto';
import { GetByIDTodoDTO, GetByIdTodoDTOType } from '../dto/get-todo-by-id.dto';
import { PaginationDTO, PaginationDTOType } from '../dto/pagination.dto';
import { TodoDTO, TodoList } from '../dto/todo.dto';

@Controller('todos')
export class TodoController {
	constructor(
		@inject(TokenTodoRepository)
		private readonly todoRepo: ITodoRepository
	) {}

	@Get('/:id', {
		schema: {
			tags: ['todo'],
			security: [
				{
					Bearer: [''],
				},
			],
			params: GetByIDTodoDTO,
			response: {
				200: TodoDTO,
			},
		},
		preHandler: JWTGuard,
	})
	getById(req: FastifyRequest<{ Params: GetByIdTodoDTOType }>) {
		const todo = this.todoRepo.findById(req.params.id);
		if (!todo) throw new NotFoundError();

		return todo;
	}

	@Get('/', {
		schema: {
			tags: ['todo'],
			security: [
				{
					Bearer: [''],
				},
			],
			querystring: PaginationDTO,
			response: {
				200: TodoList,
			},
		},
		preHandler: JWTGuard,
	})
	list(req: FastifyRequest<{ Querystring: PaginationDTOType }>) {
		return this.todoRepo.list(req.query.skip, req.query.limit);
	}

	@Post('/', {
		schema: {
			tags: ['todo'],
			security: [
				{
					Bearer: [''],
				},
			],
			body: CreateTodoDTO,
			response: {
				201: TodoDTO,
			},
		},
		preHandler: JWTGuard,
		statusCode: 201,
	})
	createTodo(req: FastifyRequest<{ Body: CreateTodoDTOType }>) {
		const todo = new TodoModel(uuid(), req.body.title, req.body.done);
		this.todoRepo.create(todo);
		return todo;
	}
}

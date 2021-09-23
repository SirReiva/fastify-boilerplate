import { FastifyRequest } from 'fastify';
import uuid from 'uuid-random';
import { Controller } from '../../core/decorators/controller.decorator';
import { Get, Post } from '../../core/decorators/route.decorator';
import { CreateTodoDTO, CreateTodoDTOType } from '../dto/create-todo.dto';
import { GetByIDTodoDTO, GetByIdTodoDTOType } from '../dto/get-todo-by-id.dto';
import { PaginationDTO, PaginationDTOType } from '../dto/pagination.dto';
import { TodoList, TodoDTO } from '../dto/todo.dto';
import { NotFoundError } from '../errors';
import { JWTGuard } from '../middlewares/jwt.middleware';

const TODOS_LIST: { title: string; done: boolean; id: string }[] = [];

@Controller('todos')
export class TodoController {
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
		const todo = TODOS_LIST.find(todo => todo.id === req.params.id);
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
		return {
			data: TODOS_LIST.slice(req.query.skip, req.query.skip + req.query.limit),
			size: TODOS_LIST.length,
		};
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
		const todo = {
			id: uuid(),
			...req.body,
		};
		TODOS_LIST.push(todo);
		return todo;
	}
}

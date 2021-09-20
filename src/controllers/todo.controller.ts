import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller } from '../core/decorators/controller.decorator';
import { Get, Post } from '../core/decorators/route.decorator';
import { CreateTodoDTO, CreateTodoDTOType } from '../dto/create-todo.dto';
import { GetByIDTodoDTO, GetByIdTodoDTOType } from '../dto/get-todo-by-id.dto';
import uuid from 'uuid-random';
import createError from 'fastify-error';
import { PaginationDTO, PaginationDTOType } from '../dto/pagination.dto';
import { TodoArray, TodoDTO } from '../dto/todo.dto';

const NotFoundError = createError('404', 'Not Found', 404);
const TODOS_LIST: { title: string; done: boolean; id: string }[] = [];

@Controller('todos')
export class TodoController {
	@Get('/:id', {
		schema: {
			//@ts-ignore
			tags: ['todo'],
			params: GetByIDTodoDTO,
			response: {
				200: TodoDTO,
			},
		},
	})
	getById(req: FastifyRequest<{ Params: GetByIdTodoDTOType }>) {
		const todo = TODOS_LIST.find(todo => todo.id === req.params.id);
		if (!todo) throw new NotFoundError();

		return todo;
	}

	@Get('/', {
		schema: {
			//@ts-ignore
			tags: ['todo'],
			querystring: PaginationDTO,
			response: {
				200: TodoArray,
			},
		},
	})
	list(req: FastifyRequest<{ Querystring: PaginationDTOType }>) {
		return TODOS_LIST.slice(req.query.skip, req.query.skip + req.query.limit);
	}
	@Post('/', {
		schema: {
			//@ts-ignore
			tags: ['todo'],
			body: CreateTodoDTO,
			response: {
				201: TodoDTO,
			},
		},
	})
	createTodo(
		req: FastifyRequest<{ Body: CreateTodoDTOType }>,
		reply: FastifyReply
	) {
		reply.status(201);
		const todo = {
			id: uuid(),
			...req.body,
		};
		TODOS_LIST.push(todo);
		return todo;
	}
}

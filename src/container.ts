import { Container } from 'inversify';
import { TokenTodoRepository } from './domain/todo.repository';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { TodoController } from './infrastructure/controllers/todo.controller';
import { InMemoryTodoRepository } from './infrastructure/repository/in-memory-todo.repository';

export const diContainer = new Container();

diContainer.bind(AuthController).toSelf();
diContainer.bind(TodoController).toSelf();

diContainer.bind(TokenTodoRepository).to(InMemoryTodoRepository);

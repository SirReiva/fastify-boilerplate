import { injectable } from "inversify";
import { TodoModel } from "../../domain/todo.model";
import { ITodoRepository } from "../../domain/todo.repository";

interface TodoDbModel {
    id: string;
    title: string;
    done: boolean;
}

@injectable()
export class InMemoryTodoRepository implements ITodoRepository {
    private todos: TodoDbModel[] = [];

    findById(id: string) {
        const existingTodo = this.todos.find(todo => todo.id === id);
        if (!existingTodo) return null;

        return new TodoModel(existingTodo.id, existingTodo.title, existingTodo.done);
    }

    list(skip: number, limit: number) {
        return {
            data: this.todos.slice(skip, skip + limit).map(todo => new TodoModel(todo.id, todo.title, todo.done)),
            size: this.todos.length
        }
    }

    create(todo: TodoModel) {
        this.todos.push({
            id: todo.getId(),
            title: todo.getTitle(),
            done: todo.isDone()
        })
    }

    update(todo: TodoModel) {
        const index = this.todos.findIndex(t => t.id === todo.getId())

        this.todos[index] = {
            id: todo.getId(),
            title: todo.getTitle(),
            done: todo.isDone()
        }
    }
}
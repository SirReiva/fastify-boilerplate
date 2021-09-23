import { Static, Type } from '@sinclair/typebox';

export const TodoDTO = Type.Object({
	title: Type.String(),
	done: Type.Boolean(),
	id: Type.String(),
});

export const TodoList = Type.Object({
	data: Type.Array(TodoDTO),
	size: Type.Integer({ minimum: 0 }),
});

export type TodoDTOType = Static<typeof TodoDTO>;

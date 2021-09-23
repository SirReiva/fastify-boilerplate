import { Static, Type } from '@sinclair/typebox';

export const CreateTodoDTO = Type.Object({
	title: Type.String(),
	done: Type.Boolean(),
});

export type CreateTodoDTOType = Static<typeof CreateTodoDTO>;

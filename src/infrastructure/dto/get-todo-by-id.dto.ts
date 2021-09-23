import { Static, Type } from '@sinclair/typebox';

export const GetByIDTodoDTO = Type.Object({
	id: Type.String(),
});

export type GetByIdTodoDTOType = Static<typeof GetByIDTodoDTO>;

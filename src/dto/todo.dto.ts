import { Static, Type } from '@sinclair/typebox';

export const TodoDTO = Type.Object({
	title: Type.String(),
	done: Type.Boolean(),
	id: Type.String(),
});

export const TodoArray = Type.Array(TodoDTO);

export type TodoDTOType = Static<typeof TodoDTO>;

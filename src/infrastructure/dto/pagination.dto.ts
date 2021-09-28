import { Static, Type } from '@sinclair/typebox';

export const PaginationDTO = Type.Object({
	skip: Type.Integer({
		minimum: 0,
	}),
	limit: Type.Integer({
		minimum: 1,
	}),
});

export type PaginationDTOType = Static<typeof PaginationDTO>;

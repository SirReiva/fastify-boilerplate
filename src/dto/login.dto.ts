import { Static, Type } from '@sinclair/typebox';

export const LoginDTO = Type.Object({
	name: Type.String(),
	password: Type.String(),
});

export const JWTDTO = Type.Object({
	token: Type.String(),
});

export type LoginDTOType = Static<typeof LoginDTO>;

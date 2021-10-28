import { Static, Type } from '@sinclair/typebox';

export const LoginDTO = Type.Object({
	name: Type.String(),
	password: Type.String(),
});

export const LoginReponseDTO = Type.Object({
	token: Type.String(),
});

export type LoginDTOType = Static<typeof LoginDTO>;
export type LoginReponseDTOType = Static<typeof LoginReponseDTO>;

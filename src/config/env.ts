import { Type } from '@sinclair/typebox';

export const EnvConfig = Type.Strict(
	Type.Object({
		PORT: Type.Integer(),
		SECRET: Type.String()
	}),

);

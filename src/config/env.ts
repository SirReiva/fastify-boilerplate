export const EnvConfig = {
	type: 'object',
	required: ['PORT'],
	properties: {
		PORT: {
			type: 'integer',
			default: 3000,
		},
	},
};

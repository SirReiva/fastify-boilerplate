import { FastifyInstance } from 'fastify';
import { PATH_PREFIX_METADATA, ROUTING_METHODS } from './constants';
import { RequestMappingMethodMetadata } from './decorators/route.decorator';

export const registerControllers = (
	fastify: FastifyInstance,
	...controllers: any[]
) => {
	controllers.forEach(Controller => {
		const prefix: string =
			Reflect.getMetadata(PATH_PREFIX_METADATA, Controller) || '';
		fastify.register(
			async (fastifyPlugin: FastifyInstance) => {
				const methodFunctions: RequestMappingMethodMetadata[] =
					Reflect.getMetadata(ROUTING_METHODS, Controller) || [];

				//DI resolve
				const instanceController = new Controller();

				for (const mtdFn of methodFunctions) {
					fastifyPlugin.route({
						method: mtdFn.method,
						url: mtdFn.path || '/',
						handler: async (req, reply) =>
							instanceController[mtdFn.methodName](req, reply),
						...mtdFn.options,
					});
				}
			},
			{
				prefix,
			}
		);
	});
};

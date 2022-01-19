import { FastifyInstance } from 'fastify';
import { Container } from 'inversify';
import { isAsyncFunction } from 'util/types';
import { PATH_PREFIX_METADATA, ROUTING_METHODS } from './constants';
import { RequestMappingMethodMetadata } from './decorators/route.decorator';
import { Type } from './interfaces';

export const registerControllers = (
	diContainer: Container,
	fastify: FastifyInstance,
	...controllers: Type[]
) => {
	controllers.forEach(Controller => {
		const prefix: string =
			Reflect.getMetadata(PATH_PREFIX_METADATA, Controller) || '';
		fastify.register(
			async (fastifyPlugin: FastifyInstance) => {
				const methodFunctions: RequestMappingMethodMetadata[] =
					Reflect.getMetadata(ROUTING_METHODS, Controller) || [];
				//DI resolve
				const instanceController = diContainer.resolve(Controller);

				for (const mtdFn of methodFunctions) {
					const { statusCode, ...routeOptions } = mtdFn.options || {};
					fastifyPlugin.route({
						method: mtdFn.method,
						url: mtdFn.path || '/',
						handler: async (req, reply) => {
							if (statusCode) reply.status(statusCode);
							const res = isAsyncFunction(instanceController[mtdFn.methodName])
								? await instanceController[mtdFn.methodName](req, reply)
								: instanceController[mtdFn.methodName](req, reply);
							if (!reply.sent) return res;
						},
						...routeOptions,
					});
				}
			},
			{
				prefix,
			}
		);
	});
};

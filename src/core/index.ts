import { FastifyInstance } from 'fastify';
import { Container } from 'inversify';
import { PATH_PREFIX_METADATA, ROUTING_METHODS } from './constants';
import { RequestMappingMethodMetadata } from './decorators/route.decorator';
import { Type } from './interfaces';
import isPromise from 'is-promise';

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
							const res = instanceController[mtdFn.methodName](req, reply);
							const result = isPromise(res) ? await res : res;
							if (!reply.sent) return result;
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

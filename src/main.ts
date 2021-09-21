import Fastify from 'fastify';
import fastifyEnv, { fastifyEnvOpt } from 'fastify-env';
import swagger, { SwaggerOptions } from 'fastify-swagger';
import 'reflect-metadata';
import { EnvConfig } from './config/env';
import { AuthController } from './controllers/auth.controller';
import { TodoController } from './controllers/todo.controller';
import { registerControllers } from './core';

const fastify = Fastify({
	logger: false,
});

const envOpts: fastifyEnvOpt = {
	schema: EnvConfig,
	dotenv: true,
};

fastify.register(fastifyEnv, envOpts);

const swggerOptions: SwaggerOptions = {
	exposeRoute: true,
	routePrefix: '/docs',
	swagger: {
		info: { title: 'fastify-api', version: '0' },
		tags: [{ name: 'todo', description: 'Todo Endpoints' }],
		securityDefinitions: {
			Bearer: {
				type: 'apiKey',
				name: 'authorization',
				in: 'header',
			},
		},
	},
};

fastify.register(swagger, swggerOptions);

registerControllers(fastify, TodoController, AuthController);

fastify.setErrorHandler((err, _req, reply) => {
	reply.status(err.statusCode || 500).send(err);
});

fastify.ready(async () => {
	try {
		console.log(`Listen http://localhost:3000`);
		//@ts-ignore
		await fastify.listen(fastify.config.PORT);
	} catch (error) {
		console.log(error);
	}
});

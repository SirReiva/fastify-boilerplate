import 'reflect-metadata';
import Fastify from 'fastify';
import { TodoController } from './controllers/todo.controller';
import { registerControllers } from './core';
import swagger, { SwaggerOptions } from 'fastify-swagger';
import { AuthController } from './controllers/auth.controller';

const fastify = Fastify({
	logger: false,
});

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

const start = async () => {
	try {
		console.log('Listen http://localhost:3000');
		await fastify.listen(3000);
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
};

start();

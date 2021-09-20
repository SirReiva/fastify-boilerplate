import 'reflect-metadata';
import Fastify from 'fastify';
import { TodoController } from './controllers/todo.controller';
import { registerControllers } from './core';
import swagger, { SwaggerOptions } from 'fastify-swagger';
import pkg from '../package.json';

const fastify = Fastify({
	logger: false,
});

const swggerOptions: SwaggerOptions = {
	exposeRoute: true,
	routePrefix: '/docs',
	swagger: {
		info: { title: 'fastify-api', version: pkg.version },
		tags: [{ name: 'todo', description: 'Todo Endpoints' }],
	},
};

fastify.register(swagger, swggerOptions);

registerControllers(fastify, TodoController);

fastify.setErrorHandler((err, _req, reply) => {
	reply.status(err.statusCode || 500).send(err);
});

const start = async () => {
	try {
		await fastify.listen(3000);
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
};

start();

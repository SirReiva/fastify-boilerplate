import Fastify from 'fastify';
import fastifyEnv, { fastifyEnvOpt } from 'fastify-env';
import metricsPlugin from 'fastify-metrics';
import swagger, { SwaggerOptions } from 'fastify-swagger';
import 'reflect-metadata';
import { EnvConfig } from './config/env';
import { AuthController } from './controllers/auth.controller';
import { TodoController } from './controllers/todo.controller';
import { registerControllers } from './core';

const app = Fastify({
	logger: false,
});

const envOpts: fastifyEnvOpt = {
	schema: EnvConfig,
	dotenv: true,
};

app.register(fastifyEnv, envOpts);

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

app.register(swagger, swggerOptions);

app.register(metricsPlugin, { endpoint: '/metrics' });

registerControllers(app, TodoController, AuthController);

app.setErrorHandler((err, _req, reply) => {
	reply.status(err.statusCode || 500).send(err);
});

app.ready(async () => {
	try {
		console.log(`Listen http://localhost:3000`);
		//@ts-ignore
		await app.listen(app.config.PORT);
	} catch (error) {
		console.log(error);
	}
});

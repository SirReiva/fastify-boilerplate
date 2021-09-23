import fastifyRequestLogger from '@mgcrea/fastify-request-logger';
import prettifier from '@mgcrea/pino-pretty-compact';
import Fastify, { FastifyServerFactory } from 'fastify';
import fastifyEnv, { fastifyEnvOpt } from 'fastify-env';
import metricsPlugin from 'fastify-metrics';
import swagger, { SwaggerOptions } from 'fastify-swagger';
import { createServer } from 'http';
import 'reflect-metadata';
import { EnvConfig } from './config/env';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { TodoController } from './infrastructure/controllers/todo.controller';
import { registerControllers } from './core';
import { Http } from '@status/codes';

const serverFactory: FastifyServerFactory = (handler, _opts) => {
	const server = createServer((req, res) => {
		handler(req, res);
	});

	return server;
};

const app = Fastify({
	logger: { prettyPrint: true, prettifier },
	disableRequestLogging: true,
	serverFactory,
});

app.register(fastifyRequestLogger);

const envOpts: fastifyEnvOpt = {
	schema: EnvConfig,
	dotenv: true,
};

app.register(fastifyEnv, envOpts);

const swggerOptions: SwaggerOptions = {
	exposeRoute: true,
	routePrefix: '/docs',
	uiConfig: {
		syntaxHighlight: {
			activate: true,
		},
	},
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
	reply.status(err.statusCode || Http.InternalServerError).send(err);
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

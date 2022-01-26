import fastifyRequestLogger from '@mgcrea/fastify-request-logger';
import prettifier from '@mgcrea/pino-pretty-compact';
import { Http } from '@status/codes';
import Fastify, { FastifyServerFactory } from 'fastify';
import fastifyEnv, { fastifyEnvOpt } from 'fastify-env';
import metricsPlugin from 'fastify-metrics';
import fastifyStatic, { FastifyStaticOptions } from 'fastify-static';
import statusPlugin from 'fastify-status';
import swagger, { SwaggerOptions } from 'fastify-swagger';
import { createServer } from 'http';
import { resolve } from 'path';
import 'reflect-metadata';
import { install } from 'source-map-support';
import { EnvConfig } from './config/env';
import { diContainer } from './container';
import { registerControllers } from './core';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { TodoController } from './infrastructure/controllers/todo.controller';

install({ environment: 'node' });

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

app.register(statusPlugin, {
	info: '/__info__',
	alive: '/__alive__',
});

app.register(swagger, swggerOptions);

app.register(metricsPlugin, { endpoint: '/metrics' });

const staticOptions: FastifyStaticOptions = {
	root: resolve(__dirname, '../public'),
	prefix: '/public/',
	wildcard: true,
	redirect: false,
};

app.register(fastifyStatic, staticOptions);

registerControllers(diContainer, app, TodoController, AuthController);

app.setErrorHandler((err, _req, reply) => {
	reply.status(err.statusCode || Http.InternalServerError).send(err);
});

app.ready(async err => {
	try {
		if (err) throw err;
		console.log(`Listen http://localhost:3000`);
		await app.listen(app.config.PORT);
	} catch (error) {
		console.log(error);
	}
});

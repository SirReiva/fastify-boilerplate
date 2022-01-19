import { Static } from '@sinclair/typebox';
import { EnvConfig } from '../config/env';

declare module 'fastify' {
	interface FastifyInstance {
		config: Static<typeof EnvConfig>;
	}
}

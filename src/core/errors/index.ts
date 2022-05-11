import createError from '@fastify/error';
import { Http } from '@status/codes';

export const NotFoundError = createError('404', 'Not Found', Http.NotFound);
export const UnAuthorizedError = createError(
	'401',
	'UnAuthorized',
	Http.Unauthorized
);

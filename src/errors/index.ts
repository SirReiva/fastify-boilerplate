import createError from 'fastify-error';

export const NotFoundError = createError('404', 'Not Found', 404);
export const UnAuthorizedError = createError('401', 'UnAuthorized', 401);

import { FastifyReply, FastifyRequest } from 'fastify';
import { UnAuthorizedError } from '../errors';
import { verifyJWT } from '../../utils/jwt.utils';

export const JWTGuard = async (req: FastifyRequest, _reply: FastifyReply) => {
	const token = req.headers.authorization?.split('Bearer ').pop();

	if (!token) throw new UnAuthorizedError();

	try {
		await verifyJWT(token, 'secret');
	} catch (error) {
		throw new UnAuthorizedError();
	}
};

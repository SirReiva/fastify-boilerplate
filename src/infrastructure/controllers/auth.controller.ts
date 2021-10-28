import { FastifyRequest } from 'fastify';
import { Controller } from '../../core/decorators/controller.decorator';
import { Post } from '../../core/decorators/route.decorator';
import { UnAuthorizedError } from '../../core/errors';
import { signJWT } from '../../utils/jwt.utils';
import {
	LoginReponseDTO,
	LoginDTO,
	LoginDTOType,
	LoginReponseDTOType,
} from '../dto/login.dto';

const USER = {
	name: 'test',
	password: '1234',
};

@Controller('/auth')
export class AuthController {
	@Post('/login', {
		schema: {
			tags: ['auth'],
			body: LoginDTO,
			response: {
				200: LoginReponseDTO,
			},
		},
	})
	async login({
		body,
	}: FastifyRequest<{ Body: LoginDTOType }>): Promise<LoginReponseDTOType> {
		const { name, password } = body;
		if (name !== USER.name || password !== USER.password)
			throw new UnAuthorizedError();

		return {
			token: await signJWT({ name }, 'secret'),
		};
	}
}

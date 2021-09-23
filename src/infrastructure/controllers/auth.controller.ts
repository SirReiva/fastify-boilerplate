import { FastifyRequest } from 'fastify';
import { Controller } from '../../core/decorators/controller.decorator';
import { Post } from '../../core/decorators/route.decorator';
import { JWTDTO, LoginDTO, LoginDTOType } from '../dto/login.dto';
import { UnAuthorizedError } from '../errors';
import { signJWT } from '../../utils/jwt.utils';

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
				200: JWTDTO,
			},
		},
	})
	async login({ body }: FastifyRequest<{ Body: LoginDTOType }>) {
		const { name, password } = body;
		if (name !== USER.name || password !== USER.password)
			throw new UnAuthorizedError();

		return {
			token: await signJWT({ name }, 'secret'),
		};
	}
}

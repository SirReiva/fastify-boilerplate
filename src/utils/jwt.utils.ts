import { sign, verify, VerifyErrors } from 'jsonwebtoken';

export const signJWT = (payload: Object, key: string): Promise<string> => {
	return new Promise((res, rej) => {
		sign(payload, key, (err: Error | null, encoded: string | undefined) => {
			if (err) return rej(err);
			res(encoded as string);
		});
	});
};

export const verifyJWT = <T>(token: string, key: string): Promise<T> => {
	return new Promise((res, rej) => {
		verify(token, key, (err: VerifyErrors | null, decoded: any | undefined) => {
			if (err) return rej(err);
			res(decoded);
		});
	});
};

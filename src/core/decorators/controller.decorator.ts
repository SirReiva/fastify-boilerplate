import { injectable } from 'inversify';
import { PATH_PREFIX_METADATA } from '../constants';

export function Controller(prefix?: string): ClassDecorator {
	return (target: any) => {
		injectable()(target);
		Reflect.defineMetadata(PATH_PREFIX_METADATA, prefix || '', target);
	};
}

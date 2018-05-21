import {ConfigExists} from './config-exists';
import {DecoratorMeta} from '../decorators/decorator-meta';

export interface ConfigOptions<T extends DecoratorMeta> {
    // TODO
    validate: boolean;
    lazyLoad: boolean;
    // TODO
    required: boolean;
    // TODO
    existsWhen: ConfigExists;
    // TODO
    toBooleanWhenExists: boolean;
    decoratorMeta: T;
    logger: {
        log(message: string, ...args: any[]): void;
        info(message: string, ...args: any[]): void;
        error(message: string, ...args: any[]): void;
        warn(message: string, ...args: any[]): void;
        debug(message: string, ...args: any[]): void;
        timeStamp?(message: string, ...args: any[]): void;
    };
}

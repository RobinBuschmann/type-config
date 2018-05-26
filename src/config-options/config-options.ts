import {DecoratorMeta} from '../decorators/decorator-meta';
import {TypeValidator} from '../validation/type-validator';

export interface ConfigOptions<T extends DecoratorMeta> {
    validate: boolean;
    warnOnly: boolean;
    lazyLoad: boolean;
    required: boolean;
    typeValidator: new() => TypeValidator;
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

export type AnyConfigOptions = ConfigOptions<any>;

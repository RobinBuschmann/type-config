import { DecoratorMeta } from '../decorators/decorator-meta';
import { TypeValidator } from '../validation/type-validator';
export interface BaseConfigOptions {
    validate: boolean;
    warnOnly: boolean;
    lazyLoad: boolean;
    required: boolean;
    logger: Logger;
}
export interface ConfigOptions<T extends DecoratorMeta> extends BaseConfigOptions {
    typeValidatorFactory: () => TypeValidator;
    decoratorMeta: T;
}
export interface Logger {
    log(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    timeStamp?(message: string, ...args: any[]): void;
}
export declare type AnyConfigOptions = ConfigOptions<any>;

import {ConfigExists} from './config-exists.enum';
import {ConfigSource} from '../config-source/config-source.model';

export interface ConfigOptions {
    validate: boolean;
    lazyLoad: boolean;
    required: boolean;
    existsWhen: ConfigExists;
    toBooleanWhenExists: boolean;
    defaultConfigSource: new () => ConfigSource;
    logger: {
        log(message: string, ...args: any[]): void;
        info(message: string, ...args: any[]): void;
        error(message: string, ...args: any[]): void;
        warn(message: string, ...args: any[]): void;
        debug(message: string, ...args: any[]): void;
        timeStamp?(message: string, ...args: any[]): void;
    };
}

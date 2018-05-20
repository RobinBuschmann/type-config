import {ConfigExists} from './config-exists.enum';
import {ConfigOptions} from './config-options.interface';
import {NodeEnvConfigSource} from '../config-source/node-env-config-source.model';

export const defaultConfigOptions: ConfigOptions = {
    validate: true,
    required: true,
    lazyLoad: true,
    existsWhen: ConfigExists.HasValue,
    toBooleanWhenExists: false,
    defaultConfigSource: NodeEnvConfigSource,
    logger: console,
};

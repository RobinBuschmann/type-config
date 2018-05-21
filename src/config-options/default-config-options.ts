import {ConfigExists} from './config-exists';
import {defaultDecoratorMeta} from '../decorators/decorator-meta';

export const defaultConfigOptions = {
    validate: true,
    required: true,
    lazyLoad: true,
    existsWhen: ConfigExists.HasValue,
    toBooleanWhenExists: false,
    logger: console,
    decoratorMeta: defaultDecoratorMeta,
};

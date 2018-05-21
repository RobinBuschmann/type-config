import {ConfigExists} from './config-exists';
import {defaultDecoratorMeta} from '../decorators/decorator-meta';

export const defaultConfigOptions = {
    validate: true,
    required: true,
    lazyLoad: true,
    warnOnly: false,
    existsWhen: ConfigExists.HasValue,
    logger: console,
    decoratorMeta: defaultDecoratorMeta,
};

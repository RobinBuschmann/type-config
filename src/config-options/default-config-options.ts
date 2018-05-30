import {DefaultDecoratorMeta, defaultDecoratorMeta} from '../decorators/decorator-meta';
import {TypeValidator} from '../validation/type-validator';
import {ConfigOptions} from './config-options';

export const defaultConfigOptions: ConfigOptions<DefaultDecoratorMeta> = {
    validate: true,
    required: true,
    lazyLoad: true,
    warnOnly: false,
    typeValidatorFactory: () => new TypeValidator(),
    logger: console,
    decoratorMeta: defaultDecoratorMeta,
};

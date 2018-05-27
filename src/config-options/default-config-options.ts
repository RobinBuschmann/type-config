import {defaultDecoratorMeta} from '../decorators/decorator-meta';
import {TypeValidator} from '../validation/type-validator';

export const defaultConfigOptions = {
    validate: true,
    required: true,
    lazyLoad: true,
    warnOnly: false,
    typeValidatorFactory: () => new TypeValidator(),
    logger: console,
    decoratorMeta: defaultDecoratorMeta,
};

import {defaultConfigOptions} from './config-options/default-config-options.value';
import {ConfigOptions} from './config-options/config-options.interface';
import {buildDecorators} from './decorators/decorator-builder';
import {DecoratorMeta} from './decorators/decorator-meta';

export const createTypeConfig = <T extends DecoratorMeta>(options: Partial<ConfigOptions<T>> = {}) =>
buildDecorators({
    ...defaultConfigOptions,
    ...options,
    decoratorMeta: {
        ...defaultConfigOptions.decoratorMeta,
        ...(options.decoratorMeta || {}),
    }
});

export const {Value, ArgsValue, EnvValue} = buildDecorators({...defaultConfigOptions});

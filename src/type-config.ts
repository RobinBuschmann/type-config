import {defaultConfigOptions} from './config-options/default-config-options';
import {ConfigOptions} from './config-options/config-options';
import {buildDecorators as internalBuildDecorators} from './decorators/decorator-builder';
import {DecoratorMeta} from './decorators/decorator-meta';

export const buildDecorators = <T extends DecoratorMeta>(options: Partial<ConfigOptions<T>> = {}) =>
    internalBuildDecorators({
    ...defaultConfigOptions,
    ...options,
    decoratorMeta: {
        ...defaultConfigOptions.decoratorMeta,
        ...(options.decoratorMeta || {}),
    }
});

export const {Value, ArgsValue, EnvValue} = buildDecorators();

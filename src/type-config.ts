import {defaultConfigOptions} from './config-options/default-config-options';
import {ConfigOptions} from './config-options/config-options';
import {buildDecorators as internalBuildDecorators} from './decorators/decorator-builder';
import {DecoratorMeta} from './decorators/decorator-meta';

export const buildDecorators = <T extends DecoratorMeta>(options: Partial<ConfigOptions<T>> = {}) => {
    // Spreading isn't working here due to https://github.com/Microsoft/TypeScript/pull/13288
    const decoratorMeta = Object.assign({}, defaultConfigOptions.decoratorMeta, options.decoratorMeta);
    return internalBuildDecorators({
        ...defaultConfigOptions,
        ...options,
        decoratorMeta,
    });
};

export const {Value, EnvValue, ArgsValue, JsonValue} = buildDecorators();

export {JsonConfiguration} from './config-source/json-config/json-configuration'
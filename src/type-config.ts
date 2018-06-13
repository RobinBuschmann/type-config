import {defaultConfigOptions} from './config-options/default-config-options';
import {ConfigOptions} from './config-options/config-options';
import {buildDecorators as internalBuildDecorators, ValueDecorators} from './decorators/decorator-builder';
import {DecoratorMeta, DefaultDecoratorMeta} from './decorators/decorator-meta';
import {ValueDecorator} from './decorators/value-decorator';

export const buildDecorators = <T extends DecoratorMeta>(options: Partial<ConfigOptions<T>> = {}): ValueDecorators<T & DefaultDecoratorMeta> => {
    // Spreading isn't working here due to https://github.com/Microsoft/TypeScript/pull/13288
    const decoratorMeta = Object.assign({}, defaultConfigOptions.decoratorMeta, options.decoratorMeta);
    return internalBuildDecorators({
        ...defaultConfigOptions,
        ...options,
        decoratorMeta,
    });
};

const decorators = buildDecorators();

export const Value: ValueDecorator = decorators.Value;
export const EnvValue: ValueDecorator = decorators.EnvValue;
export const ArgsValue: ValueDecorator = decorators.ArgsValue;
export const JsonValue: ValueDecorator = decorators.JsonValue;

export {Config} from './decorators/config';

export {ValueDecorators} from './decorators/decorator-builder';
export {ConfigSource} from './config-source/config-source'
export {NodeArgsConfigSource} from './config-source/node-args-config-source';
export {NodeEnvConfigSource} from './config-source/node-env-config-source';
export {JsonConfigSource} from './config-source/json-config/json-config-source';
export {JsonConfig} from './config-source/json-config/json-config';

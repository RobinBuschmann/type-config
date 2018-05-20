import {TypeConfig, ValueDecorator} from './type-config.model';
import {defaultConfigOptions} from './config-options/default-config-options.value';
import {ConfigOptions} from './config-options/config-options.interface';

const typeConfig = new TypeConfig(defaultConfigOptions);

export const Value: ValueDecorator = typeConfig.Value.bind(typeConfig);
export const EnvValue: ValueDecorator = typeConfig.EnvValue.bind(typeConfig);
export const ArgsValue: ValueDecorator = typeConfig.ArgsValue.bind(typeConfig);

export const createTypeConfig = (options: Partial<ConfigOptions> = {}) =>
    new TypeConfig({
        ...defaultConfigOptions,
        ...options,
    });

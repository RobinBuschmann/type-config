import 'reflect-metadata';
import {ConfigOptions} from '../config-options/config-options.interface';
import {TypeValidator} from '../type-validator';
import {ConfigValue} from '../config-value/config.value.model';
import {DecoratorMeta} from './decorator-meta';

export type ValueDecorator = (envKey: string, additionalType?: any) => PropertyDecorator;
type ValueDecorators<T> = {
    [K in keyof T]: ValueDecorator;
}

export const buildDecorators = <T extends DecoratorMeta>(options: ConfigOptions<T>): ValueDecorators<T> => {
    const typeValidator = new TypeValidator();
    return Object
        .keys(options.decoratorMeta)
        .reduce((acc, decoratorKey) => {
            acc[decoratorKey] = (
                (configKey: string, additionalType?: any): PropertyDecorator =>
                    (target, propertyKey) => {
                        new ConfigValue(typeValidator, {
                            propertyKey,
                            target,
                            additionalType,
                            configKey,
                            configSource: new options.decoratorMeta[decoratorKey](),
                            configOptions: options,
                        })
                    }
            );
            return acc;
        }, {} as ValueDecorators<T>);
};

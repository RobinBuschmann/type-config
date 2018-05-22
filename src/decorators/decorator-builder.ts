import 'reflect-metadata';
import {ConfigOptions} from '../config-options/config-options';
import {TypeValidator} from '../type-validator';
import {ConfigValue} from '../config-value/config-value';
import {DecoratorMeta} from './decorator-meta';

export type ValueDecorator = (envKey: string, additionalType?: any) => PropertyDecorator;
type ValueDecorators<T> = {
    [K in keyof T]: ValueDecorator;
}

export const buildDecorators = <T extends DecoratorMeta>(options: ConfigOptions<T>): ValueDecorators<T> => {
    // Todo@robin: Provide validator by options instead of instantiating it here
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
                            configSource: new options.decoratorMeta[decoratorKey](target),
                            configOptions: options,
                        })
                    }
            );
            return acc;
        }, {} as ValueDecorators<T>);
};

import 'reflect-metadata';
import {ConfigOptions} from '../config-options/config-options';
import {ConfigValue} from '../config-value/config-value';
import {DecoratorMeta} from './decorator-meta';

export type ValueDecorator = (identifier: string, additionalTypeOrDeserializer?: any) => PropertyDecorator;
type ValueDecorators<T> = {
    [K in keyof T]: ValueDecorator;
}

export const buildDecorators = <T extends DecoratorMeta>(configOptions: ConfigOptions<T>): ValueDecorators<T> => {
    return Object
        .keys(configOptions.decoratorMeta)
        .reduce((acc, decoratorKey) => {
            acc[decoratorKey] = (
                (configIdentifier: string, additionalTypeOrDeserializer?: any): PropertyDecorator =>
                    (target, propertyKey) => {
                        new ConfigValue({
                            propertyKey,
                            target,
                            additionalTypeOrDeserializer,
                            configIdentifier,
                            configOptions,
                            typeValidator: new configOptions.typeValidator(),
                            configSource: new configOptions.decoratorMeta[decoratorKey](target),
                        })
                    }
            );
            return acc;
        }, {} as ValueDecorators<T>);
};

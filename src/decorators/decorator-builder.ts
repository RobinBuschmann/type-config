import 'reflect-metadata';
import {ConfigOptions} from '../config-options/config-options';
import {ConfigValue} from '../config-value/config-value';
import {DecoratorMeta} from './decorator-meta';
import {ValueDecorator, ValueDecoratorOptions} from './value-decorator';

export type ValueDecorators<T> = {
    [K in keyof T]: ValueDecorator;
}

export const buildDecorators =
    <T extends DecoratorMeta>(configOptions: ConfigOptions<T>): ValueDecorators<T> => {
        const {decoratorMeta, typeValidatorFactory, ...configValueOptions} = configOptions;
        const typeValidator = typeValidatorFactory();
        return Object
            .keys(decoratorMeta)
            .reduce((acc, decoratorKey) => {
                acc[decoratorKey] = (
                    (
                        configIdentifierOrOptions: string | ValueDecoratorOptions,
                        additionalTypeOrDeserializer?: any,
                    ): PropertyDecorator => {
                        const id = typeof configIdentifierOrOptions === 'string'
                            ? configIdentifierOrOptions
                            : undefined;
                        const additionalConfigValueOptions = (id === undefined
                            ? configIdentifierOrOptions
                            : {}) as ValueDecoratorOptions;

                        return (target, propertyKey) => {
                            const configSource = new decoratorMeta[decoratorKey](configOptions, target);
                            const additionalType = configSource.hasDeserializer(additionalTypeOrDeserializer)
                                ? additionalTypeOrDeserializer
                                : undefined;
                            const deserializer = !additionalType && typeof additionalTypeOrDeserializer === 'function'
                                ? additionalTypeOrDeserializer
                                : undefined;

                            new ConfigValue({
                                ...configValueOptions,
                                propertyKey,
                                target,
                                deserializer,
                                additionalType,
                                id,
                                typeValidator,
                                configSource,
                                ...additionalConfigValueOptions,
                            })
                        }
                    }
                );
                return acc;
            }, {} as ValueDecorators<T>);
    };

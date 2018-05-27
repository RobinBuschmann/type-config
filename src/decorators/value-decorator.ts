import {AdditionalConfigValueOptions} from '../config-value/config-value-options';
import {BaseConfigOptions} from '../config-options/config-options';

export type ValueDecoratorOptions = (Partial<AdditionalConfigValueOptions> |
    Partial<BaseConfigOptions>) & {configIdentifier: string;};

export interface ValueDecorator {
    (options: ValueDecoratorOptions): PropertyDecorator;
    (identifier: string, additionalTypeOrDeserializer?: any): PropertyDecorator;
}


import { AdditionalConfigValueOptions } from '../config-value/config-value-options';
import { BaseConfigOptions } from '../config-options/config-options';
export declare type ValueDecoratorOptions = (Partial<AdditionalConfigValueOptions> | Partial<BaseConfigOptions>) & {
    id: string;
};
export interface ValueDecorator {
    (options: ValueDecoratorOptions): PropertyDecorator;
    (identifier: string, additionalTypeOrDeserializer?: any): PropertyDecorator;
}

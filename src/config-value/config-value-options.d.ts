import { ConfigSource } from '../config-source/config-source';
import { BaseConfigOptions } from '../config-options/config-options';
import { TypeValidator } from '../validation/type-validator';
export declare type Deserializer = (rawValue) => any;
export interface AdditionalConfigValueOptions {
    additionalType: any | undefined;
    deserializer: Deserializer | undefined;
}
export interface ConfigValueOptions extends BaseConfigOptions, AdditionalConfigValueOptions {
    target: any;
    propertyKey: string | symbol;
    typeValidator: TypeValidator;
    id: string;
    configSource: ConfigSource;
}

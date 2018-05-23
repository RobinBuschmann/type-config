import {ConfigSource} from '../config-source/config-source';
import {ConfigOptions} from '../config-options/config-options';
import {TypeValidator} from '../validation/type-validator';

export interface ConfigValueOptions {
    target: any;
    propertyKey: string | symbol;
    additionalTypeOrDeserializer: any;
    typeValidator: TypeValidator;
    configIdentifier: string;
    configSource: ConfigSource;
    configOptions: ConfigOptions<any>;
}

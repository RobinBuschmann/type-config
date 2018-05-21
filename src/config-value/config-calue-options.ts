import {ConfigSource} from '../config-source/config-source';
import {ConfigOptions} from '../config-options/config-options';

export interface ConfigValueOptions {
    target: any;
    propertyKey: string | symbol;
    additionalType: any;
    configKey: string;
    configSource: ConfigSource;
    configOptions: ConfigOptions<any>;
}

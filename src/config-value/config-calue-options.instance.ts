import {ConfigSource} from '../config-source/config-source.model';
import {ConfigOptions} from '../config-options/config-options.interface';

export interface ConfigValueOptions {
    target: any;
    propertyKey: string | symbol;
    additionalType: any;
    configKey: string;
    configSource: ConfigSource;
    configOptions: ConfigOptions;
}

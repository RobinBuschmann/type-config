import {ConfigSource} from './config-source';
import {AnyConfigOptions} from '../config-options/config-options';

export type ConfigSourceType = new (option: AnyConfigOptions, target: any) => ConfigSource;

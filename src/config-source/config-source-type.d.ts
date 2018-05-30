import { ConfigSource } from './config-source';
import { AnyConfigOptions } from '../config-options/config-options';
export declare type ConfigSourceType = new (option: AnyConfigOptions, target: any) => ConfigSource;

import 'reflect-metadata';
import { ConfigOptions } from '../config-options/config-options';
import { DecoratorMeta } from './decorator-meta';
import { ValueDecorator } from './value-decorator';
export declare type ValueDecorators<T> = {
    [K in keyof T]: ValueDecorator;
};
export declare const buildDecorators: <T extends DecoratorMeta>(configOptions: ConfigOptions<T>) => ValueDecorators<T>;

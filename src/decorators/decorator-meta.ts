import {NodeEnvConfigSource} from '../config-source/node-env-config-source.model';
import {ConfigSource} from '../config-source/config-source.model';
import {NodeArgsConfigSource} from '../config-source/node-args-config-source.model';

export type DecoratorMeta = {
    [decoratorKey: string]: new () => ConfigSource
};
export type DefaultDecoratorMeta = typeof defaultDecoratorMeta;

export const defaultDecoratorMeta = {
    Value: NodeEnvConfigSource,
    EnvValue: NodeEnvConfigSource,
    ArgsValue: NodeArgsConfigSource,
};
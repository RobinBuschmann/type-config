import {NodeEnvConfigSource} from '../config-source/node-env-config-source';
import {ConfigSource} from '../config-source/config-source';
import {NodeArgsConfigSource} from '../config-source/node-args-config-source';

export type DecoratorMeta = {
    [decoratorKey: string]: new () => ConfigSource
};
export type DefaultDecoratorMeta = typeof defaultDecoratorMeta;

export const defaultDecoratorMeta = {
    Value: NodeEnvConfigSource,
    EnvValue: NodeEnvConfigSource,
    ArgsValue: NodeArgsConfigSource,
};
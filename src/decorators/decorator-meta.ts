import {NodeEnvConfigSource} from '../config-source/node-env-config-source';
import {ConfigSource} from '../config-source/config-source';
import {NodeArgsConfigSource} from '../config-source/node-args-config-source';
import {JsonConfigSource} from '../config-source/json-config-source';

export type DecoratorMeta = {
    [decoratorKey: string]: new (target: any) => ConfigSource
};

export const defaultDecoratorMeta = {
    Value: NodeEnvConfigSource,
    EnvValue: NodeEnvConfigSource,
    ArgsValue: NodeArgsConfigSource,
    JsonValue: JsonConfigSource,
};
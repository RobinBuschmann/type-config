import {NodeEnvConfigSource} from '../config-source/node-env-config-source';
import {NodeArgsConfigSource} from '../config-source/node-args-config-source';
import {JsonConfigSource} from '../config-source/json-config/json-config-source';
import {ConfigSourceType} from '../config-source/config-source-type';

export type DecoratorMeta = {
    [decoratorKey: string]: ConfigSourceType;
};

export const defaultDecoratorMeta = {
    Value: NodeEnvConfigSource,
    EnvValue: NodeEnvConfigSource,
    ArgsValue: NodeArgsConfigSource,
    JsonValue: JsonConfigSource,
};
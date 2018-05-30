import { NodeEnvConfigSource } from '../config-source/node-env-config-source';
import { NodeArgsConfigSource } from '../config-source/node-args-config-source';
import { JsonConfigSource } from '../config-source/json-config/json-config-source';
import { ConfigSourceType } from '../config-source/config-source-type';
export declare type DecoratorMeta = {
    [decoratorKey: string]: ConfigSourceType;
};
export interface DefaultDecoratorMeta extends DecoratorMeta {
    Value: typeof NodeEnvConfigSource;
    EnvValue: typeof NodeEnvConfigSource;
    ArgsValue: typeof NodeArgsConfigSource;
    JsonValue: typeof JsonConfigSource;
}
export declare const defaultDecoratorMeta: DefaultDecoratorMeta;

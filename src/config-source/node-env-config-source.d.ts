import { ConfigSource } from './config-source';
export declare class NodeEnvConfigSource extends ConfigSource {
    getValue(key: string): string | undefined;
}

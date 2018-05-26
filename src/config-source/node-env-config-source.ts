import {ConfigSource} from './config-source';

export class NodeEnvConfigSource extends ConfigSource {

    getValue(key: string): string | undefined {
        return process.env[key];
    }
}

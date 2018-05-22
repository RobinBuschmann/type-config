import {ConfigSource} from './config-source';

export class NodeEnvConfigSource extends ConfigSource {

    getValue(key: string): string | undefined {
        return process.env[key];
    }

    hasValue(key: string): boolean {
        return process.env[key] !== undefined;
    }

    hasKey(key: string): boolean {
        return key in process.env;
    }

}

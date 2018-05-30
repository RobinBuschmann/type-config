import { ConfigSource } from '../config-source';
import { AnyConfigOptions } from '../../config-options/config-options';
export declare class JsonConfigSource extends ConfigSource {
    protected options: AnyConfigOptions;
    protected target: any;
    private isJsonConfigPrepared;
    private jsonConfig;
    constructor(options: AnyConfigOptions, target: any);
    getValue(path: string): string | undefined;
    private resolveValue(path);
    private getJsonFilepath();
    private prepareJsonIfNotAlreadyPrepared();
}

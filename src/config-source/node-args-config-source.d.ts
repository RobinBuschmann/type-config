import { ConfigSource } from './config-source';
import { AnyConfigOptions } from '../config-options/config-options';
export declare class NodeArgsConfigSource extends ConfigSource {
    protected options: AnyConfigOptions;
    protected target: any;
    private preparedArgs;
    constructor(options: AnyConfigOptions, target: any);
    getValue(key: string): string;
    private prepareArgs();
}

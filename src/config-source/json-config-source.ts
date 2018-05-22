import {ConfigSource} from './config-source';

const JSON_SOURCE_FILEPATH_META_KEY = 'type-config:json-filepath';
const JSON_SOURCE_PATH_SEPARATOR = '.';

export const JsonConfiguration = (filePath: string): ClassDecorator => target => {
    Reflect.defineMetadata(JSON_SOURCE_FILEPATH_META_KEY, filePath, target.prototype);
};

export class JsonConfigSource extends ConfigSource {

    private isJsonConfigPrepared: boolean = false;
    private jsonConfig: any;

    constructor(protected target: any) {
        super(target, [
            [Number, value => value],
            [Boolean, value => value],
            [String, value => value],
            [Array, value => value],
        ]);
    }

    getValue(path: string): string | undefined {
        this.prepareJsonIfNotAlreadyPrepared();
        return this.resolveValue(path);
    }

    hasValue(path: string): boolean {
        this.prepareJsonIfNotAlreadyPrepared();
        return this.resolveValue(path) !== undefined;
    }

    private resolveValue(path: string) {
        return path.split(JSON_SOURCE_PATH_SEPARATOR)
            .reduce((acc, key) => (acc !== undefined && acc[key] !== undefined)
                ? acc[key]
                : undefined
                , this.jsonConfig)
            ;
    }

    private getJsonFilepath(): string | undefined {
        return Reflect.getMetadata(JSON_SOURCE_FILEPATH_META_KEY, this.target);
    }

    private prepareJsonIfNotAlreadyPrepared() {
        if (!this.isJsonConfigPrepared) {
            const jsonFilePath = this.getJsonFilepath();
            if (!jsonFilePath) {
                throw new Error(`"JsonConfiguration" decorator is missing on class "${this.target.name}"`);
            }
            this.jsonConfig = require(jsonFilePath);
            this.isJsonConfigPrepared = true;
        }
    }

}

import {ConfigSource} from '../config-source';
import {JSON_SOURCE_FILEPATH_META_KEY} from './json-configuration';
import {JsonConfigDecoratorMissingError} from './json-config-decorator-missing-error';
import {JsonConfigDecoratorFilepathError} from './json-config-decorator-filepath-error';
import {AnyConfigOptions} from '../../config-options/config-options';

const JSON_SOURCE_PATH_SEPARATOR = '.';

export class JsonConfigSource extends ConfigSource {

    private isJsonConfigPrepared: boolean = false;
    private jsonConfig: any;

    constructor(protected options: AnyConfigOptions,
                protected target: any) {
        super(options, target, [
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
        if (!this.options.lazyLoad) {
            throw new Error(`"lazyLoad" need to be true to work properly with JsonConfig`);
        }
        if (!this.isJsonConfigPrepared) {
            const jsonFilePath = this.getJsonFilepath();
            if (!jsonFilePath) {
                throw new JsonConfigDecoratorMissingError(`"JsonConfiguration" decorator is missing on class` +
                    ` "${this.target.constructor.name}"`);
            }
            try {
                this.jsonConfig = require(jsonFilePath);
                this.isJsonConfigPrepared = true;
            } catch (e) {
                if (/Cannot find module/.test(e.toString())) {
                    throw new JsonConfigDecoratorFilepathError(`File path "./wrong-path" is wrong in` +
                        ` "JsonConfiguration" decorator of class "${this.target.constructor.name}"`);
                }
                throw e;
            }
        }
    }

}

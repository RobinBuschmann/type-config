export const JSON_SOURCE_FILEPATH_META_KEY = 'type-config:json-filepath';

export const JsonConfiguration = (filePath: string): ClassDecorator => target => {
    Reflect.defineMetadata(JSON_SOURCE_FILEPATH_META_KEY, filePath, target.prototype);
};
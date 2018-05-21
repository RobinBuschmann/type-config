type DeserializeFunction = (value, options) => any;
export type TypeDeserializer = [any, DeserializeFunction];

export abstract class ConfigSource {

    protected typeDeserializerMap: Map<any, DeserializeFunction>;
    protected defaultDeserializer = value => value;

    constructor(protected typeDeserializer: TypeDeserializer[] = []) {

        this.typeDeserializerMap = new Map<any, DeserializeFunction>(
            [
                [Array, (value, {deserializer}) => value.split(',').map(deserializer)],
                [Boolean, value => value === true || value === '1' || value === 'true'],
                [Number, value => parseFloat(value)],
                [Object, (value) => {
                    try {
                        return JSON.parse(value);
                    } catch {
                        return value;
                    }
                }],
                [String, value => value],
                [Symbol, value => Symbol(value)],
                ...typeDeserializer,
            ],
        );
    }

    abstract getValue(key: string): string | undefined;

    abstract hasValue(key: string): boolean;

    abstract hasKey(key: string): boolean;

    deserialize(type: any,
                value: string,
                additionalType?: any) {
        const deserializer = this.getDeserializer(type);
        const additionalTypeDeserializer = this.getDeserializer(additionalType);
        return deserializer(value, {deserializer: additionalTypeDeserializer});
    }

    private getDeserializer(type: any) {
        if (this.typeDeserializerMap.has(type)) {
            return this.typeDeserializerMap.get(type) as DeserializeFunction;
        }
        // Todo@robin: Consider deserializer for objects especially types
        return this.defaultDeserializer;
    }

}
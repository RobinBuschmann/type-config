import {AnyConfigOptions} from '../config-options/config-options';
import {Deserializer, TypeDeserializer} from '../deserialization/type-deserializer';

export abstract class ConfigSource {

    protected typeDeserializerMap: Map<any, Deserializer>;
    protected defaultDeserializer = value => value;

    constructor(protected options: AnyConfigOptions,
                protected target: any,
                protected typeDeserializer: TypeDeserializer[] = []) {

        this.typeDeserializerMap = new Map<any, Deserializer>(
            [
                [Array, (value, {deserializer}) => value.split(',').map(deserializer)],
                [Boolean, value => value === true || value === '1' || value === 'true'],
                [Number, value => parseFloat(value)],
                [Date, value => new Date(value)],
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

    abstract getValue(identifier: string): string | undefined;

    hasDeserializer(type) {
        return this.typeDeserializerMap.has(type);
    }

    deserialize(type: any,
                value: string,
                additionalType?: any) {
        const deserializer = this.getDeserializer(type);
        const additionalTypeDeserializer = this.getDeserializer(additionalType);
        return deserializer(value, {deserializer: additionalTypeDeserializer});
    }

    private getDeserializer(type: any) {
        if (this.typeDeserializerMap.has(type)) {
            return this.typeDeserializerMap.get(type) as Deserializer;
        }
        // Todo@robin: Consider deserializer for objects especially types
        return this.defaultDeserializer;
    }

}
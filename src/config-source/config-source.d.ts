import { AnyConfigOptions } from '../config-options/config-options';
import { Deserializer, TypeDeserializer } from '../deserialization/type-deserializer';
export declare abstract class ConfigSource {
    protected options: AnyConfigOptions;
    protected target: any;
    protected typeDeserializer: TypeDeserializer[];
    protected typeDeserializerMap: Map<any, Deserializer>;
    protected defaultDeserializer: (value: any) => any;
    constructor(options: AnyConfigOptions, target: any, typeDeserializer?: TypeDeserializer[]);
    abstract getValue(identifier: string): string | undefined;
    deserialize(type: any, value: string, additionalType?: any): any;
    private getDeserializer(type);
}

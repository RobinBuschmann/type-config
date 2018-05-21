import {ConfigOptions} from '../config-options/config-options';
import {ConfigSource} from '../config-source/config-source';
import {TypeValidator} from '../type-validator';
import {ConfigValueOptions} from './config-calue-options';

const defaultPropertyDescriptorOptions = {
    enumerable: true
};

export class ConfigValue {

    private value: any;
    private type: any;
    private defaultValue: any;
    private isLoaded: boolean = false;
    private target: any;
    private propertyKey: string | symbol;

    private configKey: string;
    private additionalType: any;
    private configSource: ConfigSource;
    private configOptions: ConfigOptions<any>;

    constructor(private typeValidator: TypeValidator,
                options: ConfigValueOptions) {

        Object.keys(options).forEach(key => this[key] = options[key]);

        this.loadType();

        if (!this.configOptions.lazyLoad) {
            this.loadAndValidateValue();
        }
        this.initTargetPropertyGettersAndSetters();
    }

    private initTargetPropertyGettersAndSetters() {
        const configValue = this;
        Object.defineProperty(this.target, this.propertyKey, {
            ...defaultPropertyDescriptorOptions,
            get() {
                if (!configValue.isLoaded) {
                    configValue.loadAndValidateValue();
                }
                configValue.setDefaultWhenValueIsUndefined();
                configValue.shadowValueIfNotAlreadyShadowed(this);

                return configValue.value;
            },
            set(value) {
                configValue.defaultValue = value;
                configValue.value = value;
            },
        });
    }

    private loadAndValidateValue() {
        const rawValue = this.configSource.getValue(this.configKey);
        if (rawValue !== undefined) {
            this.value = this.configSource.deserialize(this.type, rawValue, this.additionalType);
        }
        // Todo
        if (!this.typeValidator.validate(this.type, this.value)) {
            this.configOptions.logger.warn(`Deserialized value "${JSON.stringify(this.value)}" of config key ` +
                `"${this.configKey}" is not a valid ${this.type.name.toLowerCase()}`);
        }
        this.isLoaded = true;
    }

    private setDefaultWhenValueIsUndefined() {
        this.value = this.value === undefined ? this.defaultValue : this.value;
    }

    private shadowValueIfNotAlreadyShadowed(instance: any) {
        if (!instance.hasOwnProperty(this.propertyKey)) {
            Object.defineProperty(instance, this.propertyKey, {
                ...defaultPropertyDescriptorOptions,
                value: this.value,
                writable: true,
            });
        }
    }

    private loadType() {
        this.type = Reflect.getMetadata('design:type', this.target, this.propertyKey);
    }
}

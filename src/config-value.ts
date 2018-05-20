import {ConfigOptions} from './config-options/config-options.interface';
import {ConfigSource} from './config-source/config-source.model';
import {TypeValidator} from './type-validator';

interface ConfigValueOptions {
    target: any;
    propertyKey: string | symbol;
    additionalType: any;
    configKey: string;
    configSource: ConfigSource;
    configOptions: ConfigOptions;
}

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
    private configOptions: ConfigOptions;

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
            },
        });
    }

    private loadAndValidateValue() {
        const rawValue = this.configSource.getValue(this.configKey);
        if (rawValue !== undefined) {
            this.value = this.configSource.deserialize(this.type, rawValue, this.additionalType);
        }
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
            Object.defineProperty(instance, this.propertyKey, {value: this.value});
        }
    }

    private loadType() {
        this.type = Reflect.getMetadata('design:type', this.target, this.propertyKey);
    }
}

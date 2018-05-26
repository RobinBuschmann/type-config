import {ConfigOptions} from '../config-options/config-options';
import {ConfigSource} from '../config-source/config-source';
import {TypeValidator} from '../validation/type-validator';
import {ConfigValueOptions} from './config-calue-options';
import {ValidationError} from '../validation/validation-error';
import {ValueMissingError} from './value-missing-error';

const defaultPropertyDescriptorOptions = {
    enumerable: true,
};

export class ConfigValue {

    private value: any;
    private rawValue: any;
    private type: any;
    private defaultValue: any;
    private isLoaded: boolean = false;
    private target: any;
    private propertyKey: string | symbol;
    private typeValidator: TypeValidator;

    private configIdentifier: string;
    private additionalTypeOrDeserializer: any;
    private configSource: ConfigSource;
    private configOptions: ConfigOptions<any>;

    constructor(options: ConfigValueOptions) {

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
        this.loadValue();
        if (this.configOptions.required && this.value === undefined) {
            const message = `Value of config key "${this.configIdentifier}" is missing on ` +
                `${this.target.constructor.name}.${this.propertyKey}`;
            if (this.configOptions.warnOnly) {
                this.configOptions.logger.warn(message);
            } else {
                throw new ValueMissingError(message);
            }
        }
        if (this.configOptions.validate) {
            this.validateValue();
        }
        this.isLoaded = true;
    }

    private loadValue() {
        this.rawValue = this.configSource.getValue(this.configIdentifier);
        if (this.rawValue !== undefined) {
            if (this.additionalTypeOrDeserializer && !this.typeValidator.hasValidator(this.additionalTypeOrDeserializer)) {
                this.value = this.additionalTypeOrDeserializer(this.rawValue);
            } else {
                this.value = this.configSource.deserialize(this.type, this.rawValue, this.additionalTypeOrDeserializer);
            }
        }
    }

    private validateValue() {
        const additionalType = this.typeValidator.hasValidator(this.additionalTypeOrDeserializer)
            ? this.additionalTypeOrDeserializer
            : undefined;
        if (!this.typeValidator.validate(this.type, this.value, this.additionalTypeOrDeserializer)) {
            const message = `Value "${String(this.rawValue)}" of config key ` +
                `"${this.configIdentifier}" is not a valid ${this.type.name.toLowerCase()}` +
                (additionalType ? ` or inner value is not a valid ${additionalType.name}` : '');
            if (this.configOptions.warnOnly) {
                this.configOptions.logger.warn(message);
            } else {
                throw new ValidationError(message);
            }
        }
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

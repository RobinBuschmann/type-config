import {Logger} from '../config-options/config-options';
import {ConfigSource} from '../config-source/config-source';
import {TypeValidator} from '../validation/type-validator';
import {ConfigValueOptions, Deserializer} from './config-value-options';
import {ValidationError} from '../validation/validation-error';
import {ValueMissingError} from './value-missing-error';

const defaultPropertyDescriptorOptions = {
    enumerable: true,
};

export class ConfigValue implements ConfigValueOptions {

    value: any;
    rawValue: any;
    type: any;
    defaultValue: any;
    validate: boolean;
    lazyLoad: boolean;
    required: boolean;
    warnOnly: boolean;
    logger: Logger;
    isLoaded: boolean = false;
    target: any;
    additionalType: any | undefined;
    deserializer: Deserializer | undefined;
    propertyKey: string | symbol;
    typeValidator: TypeValidator;
    configIdentifier: string;
    configSource: ConfigSource;

    constructor(options: ConfigValueOptions) {

        Object.keys(options).forEach(key => this[key] = options[key]);

        this.loadType();

        if (!this.lazyLoad) {
            this.loadAndValidateValue();
        }
        this.initTargetPropertyGettersAndSetters();
    }

    private initTargetPropertyGettersAndSetters() {
        const configValue = this;
        this.setDefaultAndValueForStaticMembers();
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

    private setDefaultAndValueForStaticMembers() {
        if (this.propertyKey in this.target) {
            this.defaultValue = this.target[this.propertyKey];
            this.value = this.target[this.propertyKey];
        }
    }

    private loadAndValidateValue() {
        this.loadValue();
        const isValueUndefined = this.value === undefined;
        const isValueDefined = !isValueUndefined;
        const isValueOptional = !this.required;
        if (this.required && isValueUndefined) {
            const message = `Value of config key "${this.configIdentifier}" is missing on ` +
                `${this.target.constructor.name}.${this.propertyKey}`;
            if (this.warnOnly) {
                this.logger.warn(message);
            } else {
                throw new ValueMissingError(message);
            }
        }
        if (this.validate &&
            ((isValueOptional && isValueDefined) || this.required)) {
            this.validateValue();
        }
        this.isLoaded = true;
    }

    private loadValue() {
        this.rawValue = this.configSource.getValue(this.configIdentifier);
        if (this.rawValue !== undefined) {
            if (this.deserializer) {
                this.value = this.deserializer(this.rawValue);
            } else {
                this.value = this.configSource.deserialize(this.type, this.rawValue, this.additionalType);
            }
        }
    }

    private validateValue() {
        if (!this.typeValidator.validate(this.type, this.value, this.additionalType)) {
            const message = `Value "${String(this.rawValue)}" of config key ` +
                `"${this.configIdentifier}" is not a valid ${this.type.name.toLowerCase()}` +
                (this.additionalType ? ` or inner value is not a valid ${this.additionalType.name}` : '');
            if (this.warnOnly) {
                this.logger.warn(message);
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

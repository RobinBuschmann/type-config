type ValidatorFunction = (value, validator) => boolean;

export class TypeValidator {

    private validatorMap: Map<any, ValidatorFunction>;
    private defaultValidator = () => true;

    constructor() {
        this.validatorMap = new Map<any, ValidatorFunction>([
            [Number, value => !isNaN(value) && isFinite(value) && typeof value === 'number'],
            [Boolean, value => typeof value === 'boolean'],
            [String, value => typeof value === 'string'],
            [Date, value => value instanceof Date],
            [Array, (value, validator) => Array.isArray(value) && value.reduce((valid, v) => valid && validator(v), true)],
        ]);
    }

    validate(type, value, additionalType) {
        const validator = this.getValidator(type);
        const additionalTypeValidator = this.getValidator(additionalType);
        return validator(value, additionalTypeValidator);
    }

    hasValidator(type) {
        return this.validatorMap.has(type);
    }

    private getValidator(type) {
        const validator = this.validatorMap.get(type);
        if (validator) {
            return validator;
        }
        return this.defaultValidator;
    }
}
type ValidatorFunction = (value) => boolean;

export class TypeValidator {

    private validatorMap: Map<any, ValidatorFunction>;
    private defaultValidator = () => true;

    constructor() {
        this.validatorMap = new Map<any, ValidatorFunction>([
            [Number, value => !isNaN(value) && isFinite(value) && typeof value === 'number'],
            [Boolean, value => typeof value === 'boolean'],
            [String, value => typeof value === 'string'],
            [Array, value => Array.isArray(value)],
        ]);
    }

    validate(type, value) {
        const validator = this.getValidator(type);
        return validator(value);
    }

    private getValidator(type) {
        const validator = this.validatorMap.get(type);
        if (validator) {
            return validator;
        }
        return this.defaultValidator;
    }
}
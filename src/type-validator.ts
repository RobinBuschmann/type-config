type ValidatorFunction = (value) => boolean;

export class TypeValidator {

    private validatorMap: Map<any, ValidatorFunction>;

    constructor() {
        this.validatorMap = new Map<any, ValidatorFunction>([
            [Number, value => !isNaN(value) && typeof value === 'number'],
            [Boolean, value => typeof value === 'boolean'],
            [String, value => typeof value === 'string'],
            [Array, value => Array.isArray(value)],
            // Todo@robin: Add validators
        ]);
    }

    validate(type, value) {
        const validator = this.validatorMap.get(type);
        if (validator) {
            return validator(value);
        }
        // Todo@robin: ...or true if no validator exists for given type?
        return false;
    }
}
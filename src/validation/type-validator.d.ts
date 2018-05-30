export declare class TypeValidator {
    private validatorMap;
    private defaultValidator;
    constructor();
    validate(type: any, value: any, additionalType: any): boolean;
    hasValidator(type: any): boolean;
    private getValidator(type);
}

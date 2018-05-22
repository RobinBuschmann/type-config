import {BaseError} from '../common/base-error';

export class ValidationError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}
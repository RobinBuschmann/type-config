import {BaseError} from '../common/base-error';

export class ValueMissingError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}
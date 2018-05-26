import {BaseError} from '../../common/base-error';

export class JsonConfigDecoratorMissingError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}
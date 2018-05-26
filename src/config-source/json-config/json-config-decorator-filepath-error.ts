import {BaseError} from '../../common/base-error';

export class JsonConfigDecoratorFilepathError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}
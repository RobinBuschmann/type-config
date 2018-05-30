export declare class _BaseError extends Error {
    constructor(message: string);
}

export const BaseError: typeof _BaseError = (function(message: string) {
    this.message = message || '';
    if (this.constructor.name) {
        this.name = this.constructor.name;
    }
    if (Error.captureStackTrace) {
        // V8 stack trace capture.
        Error.captureStackTrace(this, this.constructor);
    } else {
        // Fallback stack trace capture.
        this.stack = Error().stack;
    }
}) as any;

BaseError.prototype = Object.create(Error.prototype);
BaseError.prototype.constructor = BaseError;
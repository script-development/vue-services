export class MissingTranslationError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        /* istanbul ignore else */
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        // Not available on FireFox, that's why we set `istanbul ignore else`
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingTranslationError);
        }

        this.name = 'MissingTranslationError';
    }
}

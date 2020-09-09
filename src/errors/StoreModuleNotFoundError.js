export class StoreModuleNotFoundError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        this.name = 'StoreModuleNotFoundError';
    }
}

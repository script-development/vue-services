const keepALiveKey = 'keepALive';
/** setting keepALive here so we don't have to Parse it each time we get it */
const storedKeepALive = localStorage.getItem(keepALiveKey);
let keepALive = storedKeepALive ? JSON.parse(storedKeepALive) : false;

export class StorageService {
    /** @param {Boolean} value */
    set keepALive(value) {
        localStorage.setItem(keepALiveKey, value);
        keepALive = value;
    }

    get keepALive() {
        return keepALive;
    }

    /**
     * Set the given value in the storage under the given key
     * If the value is not of type String, it will be converted to String
     *
     * @param {String} key
     * @param {String | any} value
     */
    setItem(key, value) {
        // TODO :: Stryker ConditionalExpression survived
        if (!this.keepALive) return;
        if (typeof value !== 'string') value = JSON.stringify(value);
        localStorage.setItem(key, value);
    }

    /**
     * Get the value from the storage under the given key
     *
     * @param {String} key
     * @param {Boolean} [parse] if parse is given, then JSON.parse will be used to return a parsed value
     */
    getItem(key, parse) {
        // TODO :: Stryker ConditionalExpression survived
        if (!this.keepALive) return null;

        const value = localStorage.getItem(key);
        // TODO :: Stryker ConditionalExpression survived
        if (!value) return null;
        if (!parse) return value;

        try {
            return JSON.parse(value);
        } catch (_) {
            // Can it throw something else then a SyntaxError?
            // if (error instanceof SyntaxError) {
            return value;
            // }
        }
    }

    /**
     * Empty the storage
     */
    clear() {
        // TODO :: Stryker ConditionalExpression survived
        if (!this.keepALive) return;
        localStorage.clear();
    }
}

const keepALiveKey = 'keepALive';
/** setting keepALive here so we don't have to Parse it each time we get it */
let keepALive = JSON.parse(localStorage.getItem(keepALiveKey));

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
        if (!this.keepALive) return;
        if (typeof value !== 'string') value = JSON.stringify(value);
        localStorage.setItem(key, value);
    }

    /**
     * Get the value from the storage under the given key
     *
     * @param {String} key
     */
    getItem(key) {
        if (!this.keepALive) return null;
        return localStorage.getItem(key);
    }

    /**
     * Empty the storage
     */
    clear() {
        if (!this.keepALive) return;
        localStorage.clear();
    }
}

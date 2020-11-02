const keepALiveKey = 'keepALive';
/** setting keepALive here so we don't have to Parse it each time we get it */
const storedKeepALive = localStorage.getItem(keepALiveKey);
let keepALive = storedKeepALive ? JSON.parse(storedKeepALive) : false;

/**
 * Set the given value in the storage under the given key
 * If the value is not of type String, it will be converted to String
 *
 * @param {String} key
 * @param {String | any} value
 */
export const setItemInStorage = (key, value) => {
    // TODO :: Stryker ConditionalExpression survived, when mutated to false
    if (!keepALive) return;
    if (typeof value !== 'string') value = JSON.stringify(value);
    localStorage.setItem(key, value);
};

/**
 * Get the value from the storage under the given key
 *
 * @param {String} key
 * @param {Boolean} [parse] if parse is given, then JSON.parse will be used to return a parsed value
 */
export const getItemFromStorage = (key, parse) => {
    // TODO :: Stryker ConditionalExpression survived, when mutated to false
    if (!keepALive) return null;

    const value = localStorage.getItem(key);
    // TODO :: Stryker ConditionalExpression survived, when mutated to false
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
};

/** Empty the storage */
export const clearStorage = () => {
    // TODO :: Stryker ConditionalExpression survived, when mutated to false
    if (!keepALive) return;
    localStorage.clear();
};

export default {
    /** @param {Boolean} value */
    set keepALive(value) {
        localStorage.setItem(keepALiveKey, JSON.stringify(value));
        keepALive = value;
    },

    get keepALive() {
        return keepALive;
    },

    // TODO :: like this, or is the naming a bit overdone this way
    setItem: setItemInStorage,
    getItem: getItemFromStorage,
    clear: clearStorage,
};

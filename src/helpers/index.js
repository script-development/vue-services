/**
 * Makes a deep copy
 * If it's not an object or array, it will return toCopy
 *
 * @param {any} toCopy Can be anything to make a copy of
 * @returns {any}
 */
export const deepCopy = toCopy => {
    if (typeof toCopy !== 'object' || toCopy === null) {
        return toCopy;
    }

    /** @type {Object<string,any>} */
    const copyableObject = {};

    const copiedObject = Array.isArray(toCopy) ? [] : copyableObject;

    for (const key in toCopy) {
        copiedObject[key] = deepCopy(toCopy[key]);
    }

    return copiedObject;
};

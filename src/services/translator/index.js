/**
 * @todo move to types.d.ts
 * @typedef {Object} Translation
 * @property {string} singular the singular translation
 * @property {string} plural the plural translation
 */

import {MissingTranslationError} from '../../errors/MissingTranslationError';

const PLURAL = 'plural';
const SINGULAR = 'singular';

/** @type {Object.<string, Translation>} */
const TRANSLATIONS = {};

/**
 * Get plural or singular translation for given value
 *
 * @param {String} value
 * @param {PLURAL | SINGULAR} pluralOrSingular
 *
 * @throws {MissingTranslationError}
 */
const getTranslation = (value, pluralOrSingular) => {
    const translation = TRANSLATIONS[value];

    if (!translation) throw new MissingTranslationError(`Missing translation for ${value}`);
    if (!translation[pluralOrSingular]) {
        throw new MissingTranslationError(`Missing ${pluralOrSingular} translation for ${value}`);
    }

    return translation[pluralOrSingular];
};

/**
 * Capitalize the give value
 * @param {String} value
 */
const capitalize = value => `${value[0].toUpperCase()}${value.substr(1)}`;

/** @param {string} value */
export const getPluralTranslation = value => getTranslation(value, PLURAL);

export class TranslatorService {
    constructor() {
        /**
         * @type {Object.<string, Translation>}
         * @private
         */
        this._translations = {};
    }

    /**
     * Get the plural translation for the given value
     *
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    getPlural(value) {
        return this._getTranslation(value, PLURAL);
    }

    /**
     * Get the singular translation for the given value
     *
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    getSingular(value) {
        return this._getTranslation(value, SINGULAR);
    }

    /**
     * Get the singular translation for the given value and capitalize it
     *
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    getCapitalizedSingular(value) {
        return capitalize(this.getSingular(value));
    }

    /**
     * Get the plural translation for the given value and capitalize it
     *
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    getCapitalizedPlural(value) {
        return capitalize(this.getPlural(value));
    }

    /**
     * Get the either the singular or plural translation, based on the given count
     * Return the string `${count} ${translation}`
     *
     * @param {Number} count
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    maybePluralize(count, value) {
        const baseString = `${count} `;
        if (count == 1) return baseString + this.getSingular(value);
        return baseString + this.getPlural(value);
    }

    /**
     * @param {string} key
     * @param {Translation} translation
     */
    setTranslation(key, translation) {
        this._translations[key] = translation;
    }
}

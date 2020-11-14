/**
 * @todo move to types.d.ts
 * @typedef {Object} Translation
 * @property {string} singular the singular translation
 * @property {string} plural the plural translation
 */

import {MissingTranslationError} from '../../errors/MissingTranslationError';
// TODO :: this is not done!
const PLURAL = 'plural';
const SINGULAR = 'singular';

/** @type {Object.<string, Translation>} */
const TRANSLATIONS = {};

/**
 * Get plural or singular translation for given moduleName
 *
 * @param {String} moduleName
 * @param {PLURAL | SINGULAR} pluralOrSingular
 *
 * @throws {MissingTranslationError}
 */
const getTranslation = (moduleName, pluralOrSingular) => {
    const translation = TRANSLATIONS[moduleName];

    if (!translation) throw new MissingTranslationError(`Missing translation for ${moduleName}`);
    if (!translation[pluralOrSingular]) {
        throw new MissingTranslationError(`Missing ${pluralOrSingular} translation for ${moduleName}`);
    }

    return translation[pluralOrSingular];
};

/**
 * Capitalize the give value
 * @param {String} value
 */
const capitalize = value => `${value[0].toUpperCase()}${value.substr(1)}`;

/**
 * Get the plural translation for the given moduleName
 *
 * @param {String} moduleName
 *
 * @throws {MissingTranslationError}
 */
export const getPluralTranslation = moduleName => getTranslation(moduleName, PLURAL);

/**
 * Get the plural translation for the given moduleName and capitalize it
 *
 * @param {String} moduleName
 *
 * @throws {MissingTranslationError}
 */
export const getCapitalizedPluralTranslation = moduleName => capitalize(getPluralTranslation(moduleName));

/**
 * Get the singular translation for the given moduleName
 *
 * @param {String} moduleName
 *
 * @throws {MissingTranslationError}
 */
export const getSingularTranslation = moduleName => getTranslation(moduleName, SINGULAR);

/**
 * Get the singular translation for the given moduleName and capitalize it
 *
 * @param {String} moduleName
 *
 * @throws {MissingTranslationError}
 */
export const getCapitalizedSingularTranslation = moduleName => capitalize(getSingularTranslation(moduleName));

/**
 * Get the either the singular or plural translation, based on the given count
 * Return the string `${count} ${translation}`
 *
 * @param {Number} count
 * @param {String} moduleName
 *
 * @throws {MissingTranslationError}
 */
export const maybePluralize = (count, moduleName) => {
    const baseString = `${count} `;
    if (count == 1) return baseString + getSingularTranslation(moduleName);
    return baseString + getPluralTranslation(moduleName);
};

/**
 * @param {string} moduleName
 * @param {Translation} translation
 */
export const setTranslation = (moduleName, translation) => (TRANSLATIONS[moduleName] = translation);

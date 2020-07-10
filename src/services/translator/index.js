/**
 * @typedef {Object} Translation
 * @property {string} singular the singular translation
 * @property {string} plural the plural translation
 */

import { MissingTranslationError } from "../../errors/MissingTranslationError";

const PLURAL = 'plural'
const SINGULAR = 'singular'

const capitalize = value => `${value[0].toUpperCase()}${value.substr(1)}`;

export class TranslatorService {
    constructor() {
        /** @type {Object.<string, Translation>}*/
        this._translations = {};
    }

    getTranslation(value, pluralOrSingular) {
        const translation = this._translations[value]

        if(!translation) throw new MissingTranslationError(`Missing translation for ${value}`)
        if(!translation[pluralOrSingular]) throw new MissingTranslationError(`Missing ${pluralOrSingular} translation for ${value}`)

        return translation[pluralOrSingular];
    }

    getPlural(value) {
        return this.getTranslation(value, PLURAL);
    }

    getSingular(value) {
        return this.getTranslation(value, SINGULAR);
    }

    getCapitalizedSingular(value) {
        return capitalize(this.getSingular(value));
    }

    getCapitalizedPlural(value) {
        return capitalize(this.getPlural(value));
    }

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

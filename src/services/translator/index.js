/**
 * @typedef {Object} Translation
 * @property {string} singular the singular translation
 * @property {string} plural the plural translation
 */

export class TranslatorService {
    /**
     * @todo :: make this work
     * @param {Object.<string, Translation>} translations the translations object
     */
    // constructor(translations) {
    //     this._translations = translations;
    // }

    constructor() {
        this._translations = {};
    }

    capitalize(value) {
        return `${value[0].toUpperCase()}${value.substr(1)}`;
    }

    getPlural(value) {
        if (!this._translations[value]) {
            console.warn('Missing translation for', value);
            return;
        }
        return this._translations[value].plural;
    }

    getSingular(value) {
        if (!this._translations[value]) {
            console.warn('Missing translation for', value);
            return;
        }
        return this._translations[value].singular;
    }

    getCapitalizedSingular(value) {
        return this.capitalize(this.getSingular(value));
    }

    getCapitalizedPlural(value) {
        return this.capitalize(this.getPlural(value));
    }

    maybePluralize(count, value) {
        const baseString = `${count} `;
        if (count == 1) return baseString + this.getSingular(value);
        return baseString + this.getPlural(value);
    }
}

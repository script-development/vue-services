/**
 * @typedef {Object} Translation
 * @property {string} singular the singular translation
 * @property {string} plural the plural translation
 */

const capitalize = value => `${value[0].toUpperCase()}${value.substr(1)}`;

const printWarning = value => {
    console.warn('Missing translation for', value);
    console.warn(
        `Set translation in the controller with this._translatorService.setTranslation('${value}', {singular:'',plural:''})`
    );
};

export class TranslatorService {
    constructor() {
        /** @type {Object.<string, Translation>}*/
        this._translations = {};
    }

    getPlural(value) {
        if (!this._translations[value]) {
            return printWarning(value);
        }
        return this._translations[value].plural;
    }

    getSingular(value) {
        if (!this._translations[value]) {
            return printWarning(value);
        }
        return this._translations[value].singular;
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

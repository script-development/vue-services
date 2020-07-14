/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

export class ButtonCreator {
    constructor() {
        this._buttonContainerHTMLElement = 'b-form-group';
        this._buttonContainerClass = 'mb-3';
        this._buttonHTMLElement = 'b-button';
    }

    /**
     *
     * @param {CreateElement} h
     * @param {String} type
     * @param {String} innerHTML
     * @param {String} variant
     */
    button(h, type, innerHTML, variant) {
        return h(
            this._buttonContainerHTMLElement,
            {
                class: this._buttonContainerClass,
            },
            [
                h(this._buttonHTMLElement, {
                    props: {variant, type},
                    domProps: {innerHTML},
                }),
            ]
        );
    }

    submitButton(h) {
        return this.button(h, 'submit', 'Opslaan', 'secondary');
    }
}

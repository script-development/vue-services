/**
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('./buttons').ButtonCreator} ButtonCreator
 */
export class FormCreator {
    /**
     * @param {ButtonCreator} buttonCreator
     */
    constructor(buttonCreator) {
        /** @type {CreateElement} */
        this._h;
        this._buttonCreator = buttonCreator;

        this._formHTMLElement = 'b-form';
        this._formClass = 'edit-form';
    }

    init(h) {
        this._h = h;
    }

    /**
     * @param {CreateElement} h
     * @param {VNode[]} children
     * @param {Function} submit
     */
    form(h, children, submit) {
        return h(
            this._formHTMLElement,
            {
                class: this._formClass,
                novalidate: true,
                on: {
                    submit: e => {
                        e.preventDefault();
                        submit();
                    },
                },
            },
            [...children, this._buttonCreator.submitButton(h)]
        );
    }
}

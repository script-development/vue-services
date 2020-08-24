/**
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('vue').Component} Component
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 */

export class BaseCreator {
    constructor() {
        /** @type {CreateElement} */
        this._h;
    }

    // prettier-ignore
    /** @param {CreateElement} h */
    set h(h) { this._h = h; }

    /** @param {VNode[]} children */
    createContainer(children) {
        return this._h('div', {class: 'ml-0 container'}, children);
    }

    /** @param {VNode[]} children */
    createCard(children) {
        return this._h('div', {class: 'card mb-2'}, [this._h('div', {class: 'card-body'}, children)]);
    }

    /** @param {String} title */
    createTitle(title, header = 'h1') {
        return this._h(header, [title]);
    }

    /** @param {String} subject */
    createSubmitButton(text) {
        return this._h('button', {type: 'submit', class: 'btn btn-primary'}, text);
    }

    /**
     * @param {VNode[]} children
     * @param {number} [mt]
     */
    createRow(children, mt) {
        let classes = 'row';
        if (mt) classes += ` mt-${mt}`;
        return this._h('div', {class: classes}, children);
    }
    /**
     * @param {VNode[]} children
     * @param {number} [md]
     */
    createCol(children, md) {
        const className = md ? `col-md-${md}` : 'col';
        return this._h('div', {class: className}, children);
    }

    /** @param {String} title */
    createTitleRow(title) {
        return this.createRow([this.createCol([this.createTitle(title)])]);
    }

    /**
     * @param {String} text
     * @param {Function} clickFunction
     */
    createTitleButton(text, clickFunction) {
        return this._h('div', {class: 'd-flex justify-content-md-end align-items-center col'}, [
            this._h('button', {class: 'btn overview-add-btn py-2 btn-primary', on: {click: clickFunction}}, [text]),
        ]);
    }
}

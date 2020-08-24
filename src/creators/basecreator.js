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
    container(children) {
        return this._h('div', {class: 'ml-0 container'}, children);
    }

    /** @param {VNode[]} children */
    card(children) {
        return this._h('div', {class: 'card mb-2'}, [this._h('div', {class: 'card-body'}, children)]);
    }

    /** @param {String} title */
    title(title, header = 'h1') {
        return this._h(header, [title]);
    }

    /**
     * @param {VNode[]} children
     * @param {number} [mt]
     */
    row(children, mt) {
        let classes = 'row';
        if (mt) classes += ` mt-${mt}`;
        return this._h('div', {class: classes}, children);
    }
    /**
     * @param {VNode[]} children
     * @param {number} [md]
     */
    col(children, md) {
        const className = md ? `col-md-${md}` : 'col';
        return this._h('div', {class: className}, children);
    }

    /** @param {String} title */
    titleRow(title) {
        return this.row([this.col([this.title(title)])]);
    }

    /**
     * @param {String} text
     * @param {Function} clickFunction
     */
    titleButton(text, clickFunction) {
        return this._h('div', {class: 'd-flex justify-content-md-end align-items-center col'}, [
            this._h('button', {class: 'btn overview-add-btn py-2 btn-primary', on: {click: clickFunction}}, [text]),
        ]);
    }
}

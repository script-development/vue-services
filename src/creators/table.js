/**
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('bootstrap-vue').BvTableField} BvTableField
 */

import {BTable} from 'bootstrap-vue';

export class TableCreator {
    /**
     * @param {TranslatorService} translatorService
     */
    constructor(translatorService) {
        /** @type {CreateElement} */
        this._h;
        this._translatorService = translatorService;
    }

    // prettier-ignore
    /** @param {CreateElement} h */
    set h(h) { this._h = h; }

    /**
     * @param {String} subject the subject for which to create the table for
     * @param {BvTableField[]} fields the subject for which to create the table for
     * @param {Function} [rowClicked] the subject for which to create the table for
     */
    table(subject, fields, rowClicked) {
        // define tableCreator here, cause this context get's lost in the return object
        const creator = this;
        const title = creator.title(creator._translatorService.getCapitalizedPlural(subject) + ' overzicht');

        return {
            props: {items: {type: Array, required: true}},
            data: () => ({perPage: 20}),
            methods: {
                infiniteScroll() {
                    const docElement = document.documentElement;
                    // check if bottom, then add 20 rows to the table
                    if (docElement.scrollTop + window.innerHeight === docElement.offsetHeight) {
                        if (this.perPage > this.items.length) return;
                        this.perPage += 20;
                    }
                },
            },
            mounted() {
                window.onscroll = () => this.infiniteScroll();
                this.infiniteScroll();
            },
            render() {
                return creator.card([title, creator.bTable(this.items, this.perPage, fields, rowClicked)]);
            },
        };
    }

    /** @param {VNode[]} children */
    card(children) {
        return this._h('div', {class: 'card'}, [this._h('div', {class: 'card-body'}, children)]);
    }

    /** @param {String} title */
    title(title) {
        return this._h('h4', [title]);
    }

    bTable(items, perPage, fields, rowClicked) {
        return this._h(BTable, {
            props: {items, perPage, fields, borderless: true, hover: true, responsive: true},
            on: {'row-clicked': rowClicked},
        });
    }
}

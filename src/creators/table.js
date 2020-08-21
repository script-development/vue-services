/**
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 * @typedef {import('./basecreator').BaseCreator} BaseCreator
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('bootstrap-vue').BvTableField} BvTableField
 */

import {BTable} from 'bootstrap-vue';

export class TableCreator {
    /**
     * @param {TranslatorService} translatorService
     * @param {BaseCreator} baseCreator
     */
    constructor(baseCreator, translatorService) {
        /** @type {CreateElement} */
        this._h;
        this._translatorService = translatorService;
        this._baseCreator = baseCreator;
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
        const title = creator._baseCreator.createTitle(
            creator._translatorService.getCapitalizedPlural(subject) + ' overzicht',
            'h4'
        );

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
                return creator._baseCreator.createCard([
                    title,
                    creator.bTable(this.items, this.perPage, fields, rowClicked),
                ]);
            },
        };
    }

    bTable(items, perPage, fields, rowClicked) {
        return this._h(BTable, {
            props: {items, perPage, fields, borderless: true, hover: true, responsive: true},
            on: {'row-clicked': rowClicked},
        });
    }
}

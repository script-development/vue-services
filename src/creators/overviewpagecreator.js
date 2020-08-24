/**
 * @typedef {import('./basecreator').BaseCreator} BaseCreator
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('vue').Component} Component
 */

export class OverviewPageCreator {
    /**
     * @param {BaseCreator} baseCreator
     * @param {TranslatorService} translatorService
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
     * @param {String} subject the subject for which to create the overview page
     * @param {Function} getter the table to show items in
     * @param {Component} table the table to show items in
     * @param {Component} [filter] the filter to filter the items
     * @param {Function} [toCreatePage] the function to go to the create page
     */
    create(subject, getter, table, filter, toCreatePage) {
        // define pageCreator here, cause this context get's lost in the return object
        const pageCreator = this;

        return {
            name: `overview-${subject}`,
            computed: {
                items() {
                    return getter();
                },
            },
            data() {
                return {
                    filteredItems: [],
                };
            },
            render(h) {
                const titleElement = pageCreator.createOverviewPageTitle(subject, toCreatePage);

                const containerChildren = [titleElement];

                if (filter)
                    containerChildren.push(
                        h(filter, {
                            props: {items: this.items},
                            on: {filter: items => (this.filteredItems = items)},
                        })
                    );

                const items = filter ? this.filteredItems : this.items;

                containerChildren.push(h(table, {props: {items}}));

                return pageCreator._baseCreator.container(containerChildren);
            },
        };
    }
    /**
     * @param {String} subject
     * @param {Function} [toCreatePage]
     */
    createOverviewPageTitle(subject, toCreatePage) {
        const title = this._translatorService.getCapitalizedPlural(subject);
        if (!toCreatePage) return this._baseCreator.titleRow(title);

        const titleCol = this._baseCreator.col([this._baseCreator.title(title)], 8);
        const buttonCol = this._baseCreator.titleButton(
            this._translatorService.getCapitalizedSingular(subject) + ` toevoegen`,
            toCreatePage
        );

        return this._baseCreator.row([titleCol, buttonCol]);
    }
}

/**
 * @typedef {import('./basecreator').BaseCreator} BaseCreator
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('vue').Component} Component
 */

export class ShowPageCreator {
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
     * @param {String} subject the subject for which to create the show page
     * @param {Function} getter the getter to get the show item to show
     * @param {Component} detailList the detail list that displays the actual data
     * @param {String|String[]} [titleItemProperty] the optional titleItemProperty, will show title based on the given property. If nothing is given then the creator will try to resolve a title
     * @param {Function} [toEditPage] the function to go to the edit page
     */
    create(subject, getter, detailList, titleItemProperty, toEditPage) {
        // define pageCreator here, cause this context get's lost in the return object
        const pageCreator = this;

        return {
            name: `show-${subject}`,
            computed: {
                item() {
                    return getter();
                },
            },
            render(h) {
                // TODO :: notFoundMessage should be clear
                if (!this.item) return h('div', ['Dit is nog niet gevonden']);

                const row = pageCreator._baseCreator.createRow(
                    [
                        pageCreator._baseCreator.createCol([
                            pageCreator._baseCreator.createCard([
                                pageCreator._baseCreator.createTitle(
                                    pageCreator._translatorService.getCapitalizedSingular(subject) + ' gegevens',
                                    'h4'
                                ),
                                h(detailList, {props: {item: this.item}}),
                            ]),
                        ]),
                    ],
                    3
                );

                return pageCreator._baseCreator.createContainer([
                    pageCreator.createShowPageTitle(this.item, titleItemProperty, toEditPage),
                    row,
                ]);
            },
        };
    }

    /**
     * @param {Object<string,any>} item the item for which to show the title
     * @param {String|String[]} [titleItemProperty] the optional titleItemProperty, will show title based on the given property. If nothing is given then the creator will try to resolve a title
     * @param {Function} [toEditPage] the optional to edit page function
     */
    createShowPageTitle(item, titleItemProperty, toEditPage) {
        const title = this.createTitleFromItemProperties(item, titleItemProperty);
        if (!toEditPage) return this._baseCreator.createTitleRow(title);

        const titleCol = this._baseCreator.createCol([this._baseCreator.createTitle(title)], 8);
        const buttonCol = this._baseCreator.createTitleButton(`${title} aanpassen`, toEditPage);
        return this._baseCreator.createRow([titleCol, buttonCol]);
    }
    /**
     * @param {Object<string,any>} item the item for which to show the title
     * @param {String|String[]} [titleItemProperty] the optional titleItemProperty, will show title based on the given property. If nothing is given then the creator will try to resolve a title
     */
    createTitleFromItemProperties(item, titleItemProperty) {
        // if titleItemProperty is given, create title based on that
        if (titleItemProperty) {
            if (Array.isArray(titleItemProperty)) {
                return titleItemProperty.map(prop => item[prop]).join(' ');
            }
            return item[titleItemProperty];
        }

        // if titleItemProperty is not given, try to resolve it with the most common properties
        if (item.firstname) return `${item.firstname} ${item.lastname}`;

        return item.name || item.title;
    }
}

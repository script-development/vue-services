/**
 * @typedef {import('./basecreator').BaseCreator} BaseCreator
 * @typedef {import('../services/error').ErrorService} ErrorService
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 * @typedef {import('../services/router').RouterService} RouterService
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('vue').Component} Component
 *
 * @typedef {Object} EditPageCSSClasses
 * @property {String[]} container
 */

export class EditPageCreator {
    /**
     * @param {BaseCreator} baseCreator
     * @param {ErrorService} errorService
     * @param {TranslatorService} translatorService
     */
    constructor(baseCreator, errorService, translatorService, routerService) {
        /** @type {CreateElement} */
        this._h;
        this._errorService = errorService;
        this._translatorService = translatorService;
        this._baseCreator = baseCreator;
        this._routerService = routerService;
    }

    // prettier-ignore
    /** @param {CreateElement} h */
    set h(h) { this._h = h; }

    /**
     * Generate an edit page
     * @param {Component} form the form to create stuff with
     * @param {()=>Object<string,any} getter the getter to get the instance from the store
     * @param {String} subject the subject for which to create something for
     * @param {Function} updateAction the action to send the updated model to the backend
     * @param {Function} [destroyAction] the optional destroyAction, will attach a destroy button with this action
     * @param {Function} [showAction] the optional showAction, will get data from the server if given
     * @param {String|String[]} [titleItemProperty] the optional titleItemProperty, will show title based on the given property. If nothing is given then the creator will try to resolve a title
     * @param {EditPageCSSClasses} [cssClasses] the optional css classes to override the basic classes
     */
    create(form, getter, subject, updateAction, destroyAction, showAction, titleItemProperty, cssClasses) {
        // define pageCreator here, cause this context get's lost in the return object
        const pageCreator = this;

        return {
            name: `edit-${subject}`,
            computed: {
                item() {
                    const item = getter();
                    if (item) this.editable = JSON.parse(JSON.stringify(item));
                    return item;
                },
            },
            data() {
                return {editable: {}};
            },
            render(h) {
                // TODO :: notFoundMessage should be clear
                if (!this.item) return h('div', ['Dit is nog niet gevonden']);

                const containerChildren = [
                    pageCreator.createEditPageTitle(this.item, titleItemProperty),
                    pageCreator.createForm(form, this.editable, updateAction),
                ];

                if (destroyAction) {
                    // TODO :: move to method, when there are more b-links
                    // TODO :: uses Bootstrap-Vue element
                    containerChildren.push(
                        h(
                            'b-link',
                            {
                                class: 'text-danger',
                                on: {click: destroyAction},
                            },
                            [`${pageCreator._translatorService.getCapitalizedSingular(subject)} verwijderen`]
                        )
                    );
                }

                return pageCreator._baseCreator.container(
                    containerChildren,
                    cssClasses ? cssClasses.container : undefined
                );
            },
            mounted() {
                pageCreator.checkQuery(this.editable);
                if (showAction) showAction();
            },
        };
    }

    /**
     * @param {Object<string,any>} item the item for which to show the title
     * @param {String|String[]} [titleItemProperty] the optional titleItemProperty, will show title based on the given property. If nothing is given then the creator will try to resolve a title
     */
    createEditPageTitle(item, titleItemProperty) {
        const title = this.createTitleFromItemProperties(item, titleItemProperty);

        if (!title) return this._baseCreator.titleRow('Aanpassen');

        return this._baseCreator.titleRow(title + ' aanpassen');
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
    /**
     * @param {Component} form
     * @param {Object<string,any>} editable
     * @param {(item:Object<string,any) => void} action
     */
    createForm(form, editable, action) {
        return this._h('div', {class: 'row mt-3'}, [
            this._baseCreator.col([
                this._h(form, {
                    props: {
                        editable,
                        errors: this._errorService.getErrors(),
                    },
                    on: {submit: () => action(editable)},
                }),
            ]),
        ]);
    }

    /** @param {Object<string,any>} editable */
    checkQuery(editable) {
        const query = this._routerService.query;

        if (!Object.keys(query).length) return;

        for (const key in query) {
            if (editable[key]) {
                editable[key] = query[key];
            }
        }
    }
}

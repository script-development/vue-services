/**
 * @typedef {import('../services/error').ErrorService} ErrorService
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 * @typedef {import('../services/event').EventService} EventService
 * @typedef {import('../services/router').RouterService} RouterService
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('vue').Component} Component
 */

export class PageCreator {
    /**
     * @param {ErrorService} errorService
     * @param {TranslatorService} translatorService
     * @param {EventService} eventService
     * @param {RouterService} routerService
     */
    constructor(errorService, translatorService, eventService, routerService) {
        /** @type {CreateElement} */
        this._h;
        this._errorService = errorService;
        this._translatorService = translatorService;
        this._eventService = eventService;
        this._routerService = routerService;
    }

    // prettier-ignore
    /** @param {CreateElement} h */
    set h(h) { this._h = h; }

    /**
     * Generate a create page
     * @param {Component} form the form to create stuff with
     * @param {()=>Object<string,any} modelFactory the factory to create a new instance of a model
     * @param {String} subject the subject for which to create something for
     * @param {Function} createAction the action to send the newly created model to the backend
     * @param {String} [title] the optional title, will generate default one if nothing is given
     */
    createPage(form, modelFactory, subject, createAction, title) {
        // define pageCreator here, cause this context get's lost in the return object
        const pageCreator = this;

        return {
            name: `create-${subject}`,
            data: () => ({editable: modelFactory()}),
            render() {
                const titleElement = title
                    ? pageCreator.createTitle(title)
                    : pageCreator.createCreatePageTitle(subject);

                return pageCreator.createContainer([
                    titleElement,
                    pageCreator.createForm(form, this.editable, createAction),
                ]);
            },
            mounted() {
                pageCreator.checkQuery(this.editable);
            },
        };
    }

    /**
     * Generate an edit page
     * @param {Component} form the form to create stuff with
     * @param {()=>Object<string,any} getter the getter to get the instance from the store
     * @param {String} subject the subject for which to create something for
     * @param {Function} updateAction the action to send the updated model to the backend
     * @param {Function} [destroyAction] the optional destroyAction, will attach a destroy button with this action
     * @param {Function} [showAction] the optional showAction, will get data from the server if given
     * @param {String|String[]} [titleItemProperty] the optional titleItemProperty, will show title based on the given property. If nothing is given then the creator will try to resolve a title
     */
    editPage(form, getter, subject, updateAction, destroyAction, showAction, titleItemProperty) {
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

                return pageCreator.createContainer(containerChildren);
            },
            mounted() {
                pageCreator.checkQuery(this.editable);
                if (showAction) showAction();
            },
        };
    }

    /**
     * @param {String} subject the subject for which to create the overview page
     * @param {Function} getter the table to show items in
     * @param {Component} table the table to show items in
     * @param {Component} [filter] the filter to filter the items
     * @param {Function} [toCreatePage] the function to go to the create page
     */
    overviewPage(subject, getter, table, filter, toCreatePage) {
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

                return pageCreator.createContainer(containerChildren);
            },
        };
    }

    /**
     * @param {String} subject the subject for which to create the show page
     * @param {Function} getter the getter to get the show item to show
     * @param {Component} showComponent the show component that displays the actual data
     * @param {String|String[]} [titleItemProperty] the optional titleItemProperty, will show title based on the given property. If nothing is given then the creator will try to resolve a title
     * @param {Function} [toEditPage] the function to go to the edit page
     */
    showPage(subject, getter, showComponent, titleItemProperty, toEditPage) {
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

                return pageCreator.createContainer([
                    pageCreator.createShowPageTitle(this.item, titleItemProperty, toEditPage),
                    h(showComponent, {props: {item: this.item}}),
                ]);
            },
        };
    }

    /** @param {String} title */
    createTitle(title) {
        return this._h('h1', [title]);
    }

    /** @param {VNode[]} children */
    createContainer(children) {
        return this._h('div', {class: 'ml-0 container'}, children);
    }
    /** @param {VNode[]} children */
    createRow(children) {
        return this._h('div', {class: 'row'}, children);
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

    /** @param {String} subject */
    createCreatePageTitle(subject) {
        return this.createTitleRow(this._translatorService.getCapitalizedSingular(subject) + ` toevoegen`);
    }

    /**
     * @param {String} subject
     * @param {Function} [toCreatePage]
     */
    createOverviewPageTitle(subject, toCreatePage) {
        const title = this._translatorService.getCapitalizedPlural(subject);
        if (!toCreatePage) return this.createTitleRow(title);

        const titleCol = this.createCol([this.createTitle(title)], 8);
        const buttonCol = this.createTitleButton(
            this._translatorService.getCapitalizedSingular(subject) + ` toevoegen`,
            toCreatePage
        );

        return this.createRow([titleCol, buttonCol]);
    }

    /**
     * @param {Object<string,any>} item the item for which to show the title
     * @param {String|String[]} [titleItemProperty] the optional titleItemProperty, will show title based on the given property. If nothing is given then the creator will try to resolve a title
     * @param {Function} [toEditPage] the optional to edit page function
     */
    createShowPageTitle(item, titleItemProperty, toEditPage) {
        const title = this.createTitleFromItemProperties(item, titleItemProperty);
        if (!toEditPage) return this.createTitleRow(title);

        const titleCol = this.createCol([this.createTitle(title)], 8);
        const buttonCol = this.createTitleButton(`${title} aanpassen`, toEditPage);
        return this.createRow([titleCol, buttonCol]);
    }

    createTitleButton(text, clickFunction) {
        return this._h('div', {class: 'd-flex justify-content-md-end align-items-center col'}, [
            this._h('button', {class: 'btn overview-add-btn py-2 btn-primary', on: {click: clickFunction}}, [text]),
        ]);
    }

    /**
     * @param {Object<string,any>} item the item for which to show the title
     * @param {String|String[]} [titleItemProperty] the optional titleItemProperty, will show title based on the given property. If nothing is given then the creator will try to resolve a title
     */
    createEditPageTitle(item, titleItemProperty) {
        const title = this.createTitleFromItemProperties(item, titleItemProperty);

        if (!title) return this.createTitleRow('Aanpassen');

        return this.createTitleRow(title + ' aanpassen');
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
            this.createCol([
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
            if (editable.hasOwnProperty(key)) {
                editable[key] = query[key];
            }
        }
    }
}

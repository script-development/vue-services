/**
 * @typedef {import('../error').ErrorService} ErrorService
 * @typedef {import('../translator').TranslatorService} TranslatorService
 * @typedef {import('../event').EventService} EventService
 * @typedef {import('../router').RouterService} RouterService
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('vue').Component} Component
 */

export class PageCreatorService {
    /**
     *
     * @param {ErrorService} errorService
     * @param {TranslatorService} translatorService
     * @param {EventService} eventService
     * @param {RouterService} routerService
     */
    constructor(errorService, translatorService, eventService, routerService) {
        this._errorService = errorService;
        this._translatorService = translatorService;
        this._eventService = eventService;
        this._routerService = routerService;
    }

    createPage(form, modelFactory, subject, createAction, title) {
        // define pageCreator here, cause this context get's lost in the return object
        const pageCreator = this;

        return {
            name: `create-${subject}`,
            data: () => ({editable: modelFactory()}),
            render(h) {
                const titleElement = title
                    ? pageCreator.createTitle(h, title)
                    : pageCreator.createCreatePageTitle(h, subject);

                return pageCreator.createContainer(h, [
                    titleElement,
                    pageCreator.createForm(h, form, this.editable, createAction),
                ]);
            },
            mounted() {
                pageCreator.checkQuery(this.editable);
            },
        };
    }

    editPage(form, getter, subject, updateAction, destroyAction) {
        // define pageCreator here, cause this context get's lost in the return object
        const pageCreator = this;

        let editable;
        return {
            name: `edit-${subject}`,
            computed: {
                item() {
                    const item = getter();
                    if (item) editable = JSON.parse(JSON.stringify(item));
                    return item;
                },
            },
            render(h) {
                if (!this.item) return;

                return pageCreator.createContainer(h, [
                    pageCreator.createEditPageTitle(h, this.item),
                    pageCreator.createForm(h, form, editable, updateAction),
                    // TODO :: move to method, when there are more b-links
                    h(
                        'b-link',
                        {
                            class: 'text-danger',
                            on: {click: destroyAction},
                        },
                        [`${pageCreator._translatorService.getCapitalizedSingular(subject)} verwijderen`]
                    ),
                ]);
            },
            mounted() {
                pageCreator.checkQuery(editable);
            },
        };
    }

    /**
     * @param {CreateElement} h
     * @param {VNode[]} children
     */
    createContainer(h, children) {
        // TODO :: vue3, use create element
        return h('b-container', {props: {class: 'ml-0'}}, children);
    }

    /**
     * @param {CreateElement} h
     * @param {String} title
     */
    createTitle(h, title) {
        // TODO :: vue3, use create element
        return h('h1', [title]);
    }

    /**
     * @param {CreateElement} h
     * @param {String} subject
     */
    createCreatePageTitle(h, subject) {
        // TODO :: vue3, use create element
        return h('h1', [this._translatorService.getCapitalizedSingular(subject) + ` toevoegen`]);
    }

    /**
     * @param {CreateElement} h
     * @param {Object<string,any>} item
     */
    createEditPageTitle(h, item) {
        // TODO :: vue3, use create element
        // TODO :: it's not always name!
        let name = item.name || item.title;
        if (item.firstname) {
            name = `${item.firstname} ${item.lastname}`;
        }
        return h('h1', [name + ' aanpassen']);
    }

    /**
     * @param {CreateElement} h
     * @param {Component} form
     * @param {Object<string,any>} editable
     * @param {(item:Object<string,any) => void} action
     */
    createForm(h, form, editable, action) {
        // TODO :: vue3, use create element
        return h(form, {
            props: {
                editable,
                errors: this._errorService.getErrors(),
            },
            on: {submit: () => action(editable)},
        });
    }

    /**
     * @param {Object<string,any>} editable
     */
    checkQuery(editable) {
        const query = this._routerService._router.currentRoute.query;

        if (!Object.keys(query).length) return;

        for (const key in query) {
            if (editable.hasOwnProperty(key)) {
                editable[key] = query[key];
            }
        }
    }
}

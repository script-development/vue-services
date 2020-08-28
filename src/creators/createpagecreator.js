/**
 * @typedef {import('./basecreator').BaseCreator} BaseCreator
 * @typedef {import('../services/error').ErrorService} ErrorService
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 * @typedef {import('../services/router').RouterService} RouterService
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('vue').Component} Component
 */

export class CreatePageCreator {
    /**
     * @param {BaseCreator} baseCreator
     * @param {ErrorService} errorService
     * @param {RouterService} routerService
     * @param {TranslatorService} translatorService
     */
    constructor(baseCreator, errorService, translatorService, routerService) {
        /** @type {CreateElement} */
        this._h;
        this._errorService = errorService;
        this._routerService = routerService;
        this._translatorService = translatorService;
        this._baseCreator = baseCreator;
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
    create(form, modelFactory, subject, createAction, title) {
        // define pageCreator here, cause this context get's lost in the return object
        const pageCreator = this;

        return {
            name: `create-${subject}`,
            data: () => ({editable: modelFactory()}),
            render() {
                const titleElement = title
                    ? pageCreator._baseCreator.title(title)
                    : pageCreator.createCreatePageTitle(subject);

                return pageCreator._baseCreator.container([
                    titleElement,
                    pageCreator.createForm(form, this.editable, createAction),
                ]);
            },
            mounted() {
                pageCreator.checkQuery(this.editable);
            },
        };
    }

    /** @param {String} subject */
    createCreatePageTitle(subject) {
        return this._baseCreator.titleRow(this._translatorService.getCapitalizedSingular(subject) + ` toevoegen`);
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

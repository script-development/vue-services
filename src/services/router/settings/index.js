/**
 * @typedef {import('../../translator').TranslatorService} TranslatorService
 * @typedef {import('vue').ComponentOptions} ComponentOptions
 * @typedef {import('vue-router').RouteConfig} RouteConfig
 */

import {getPluralTranslation} from '../../translator';

export const CREATE_PAGE_NAME = '.create';
export const EDIT_PAGE_NAME = '.edit';
export const OVERVIEW_PAGE_NAME = '.overview';
export const SHOW_PAGE_NAME = '.show';

/**
 *
 * @param {string} moduleName
 */
export const newRouteSettings = moduleName => {
    const names = {
        base: moduleName,
        create: moduleName + CREATE_PAGE_NAME,
        edit: moduleName + EDIT_PAGE_NAME,
        overview: moduleName + OVERVIEW_PAGE_NAME,
        show: moduleName + SHOW_PAGE_NAME,
    };

    const paths = {
        base: '/' + getPluralTranslation(moduleName),
    };
    return {
        names,
        paths,
    };
};

export class RouteSettings {
    /**
     *
     * @param {TranslatorService} translationService
     */
    constructor(translationService) {
        this._translationService = translationService;

        /** route paths */
        this._basePath;
        this._editPath = ':id/aanpassen';
        this._showPath = ':id';
        this._overviewPath = '';
        this._createPath = 'toevoegen';

        /** route components */
        this._baseComponent;
        this._editComponent;
        this._showComponent;
        this._overviewComponent;
        this._createComponent;

        /** route titles */
        this._editTitle;
        this._showTitle;
        this._overviewTitle;
        this._createTitle;

        /** route children */
        this._editChildren;
        this._showChildren;
        this._overviewChildren;
        this._createChildren;

        // TODO :: need to add cantSeeWhenLoggedIn setting to the pages
        /** show page settings */
        this._showPageAdminOnly = false;
        this._showPageAuthOnly = true;

        /** overview page settings */
        this._overviewPageAdminOnly = false;
        this._overviewPageAuthOnly = true;

        /** edit page settings */
        this._editPageAdminOnly = false;
        this._editPageAuthOnly = true;

        /** create page settings */
        this._createPageAdminOnly = false;
        this._createPageAuthOnly = true;
    }

    // prettier-ignore
    /** returns if the show page is only accessible by the admin */
    get showPageAdminOnly() { return this._showPageAdminOnly; }
    // prettier-ignore
    /** returns if the show page is only accessible by authenticated users */
    get showPageAuthOnly() { return this._showPageAuthOnly; }

    // prettier-ignore
    /** returns if the overview page is only accessible by the admin */
    get overviewPageAdminOnly() { return this._overviewPageAdminOnly; }
    // prettier-ignore
    /** returns if the overview page is only accessible by authenticated users */
    get overviewPageAuthOnly() { return this._overviewPageAuthOnly; }

    // prettier-ignore
    /** returns if the edit page is only accessible by the admin */
    get editPageAdminOnly() { return this._editPageAdminOnly; }
    // prettier-ignore
    /** returns if the edit page is only accessible by authenticated users */
    get editPageAuthOnly() { return this._editPageAuthOnly; }

    // prettier-ignore
    /** returns if the create page is only accessible by the admin */
    get createPageAdminOnly() { return this._createPageAdminOnly; }
    // prettier-ignore
    /** returns if the create page is only accessible by authenticated users */
    get createPageAuthOnly() { return this._createPageAuthOnly; }

    // prettier-ignore
    set showPageAdminOnly(value) { this._showPageAdminOnly = value; }
    // prettier-ignore
    set showPageAuthOnly(value) { this._showPageAuthOnly = value; }

    // prettier-ignore
    set overviewPageAdminOnly(value) { this._overviewPageAdminOnly = value; }
    // prettier-ignore
    set overviewPageAuthOnly(value) { this._overviewPageAuthOnly = value; }

    // prettier-ignore
    set editPageAdminOnly(value) { this._editPageAdminOnly = value; }
    // prettier-ignore
    set editPageAuthOnly(value) { this._editPageAuthOnly = value; }

    // prettier-ignore
    set createPageAdminOnly(value) { this._createPageAdminOnly = value; }
    // prettier-ignore
    set createPageAuthOnly(value) { this._createPageAuthOnly = value; }

    // prettier-ignore
    /** @returns {String} */
    get basePath() { return this._basePath; }
    // prettier-ignore
    /** @param {String} value path of the base route */
    set basePath(value) { this._basePath = value; }

    // prettier-ignore
    /** @returns {String} */
    get editPath() { return this._editPath; }
    // prettier-ignore
    /** @param {String} value path of the route */
    set editPath(value) { this._editPath = value; }

    // prettier-ignore
    /** @returns {String} */
    get showPath() { return this._showPath; }
    // prettier-ignore
    /** @param {String} value path of the route */
    set showPath(value) { this._showPath = value; }

    // prettier-ignore
    /** @returns {String} */
    get overviewPath() { return this._overviewPath; }
    // prettier-ignore
    /** @param {String} value path of the route */
    set overviewPath(value) { this._overviewPath = value; }

    // prettier-ignore
    /** @returns {String} */
    get createPath() { return this._createPath; }
    // prettier-ignore
    /** @param {String} value path of the route */
    set createPath(value) { this._createPath = value; }

    // prettier-ignore
    /** @returns {ComponentOptions} */
    get baseComponent() { return this._baseComponent; }
    // prettier-ignore
    /** @param {ComponentOptions} value component of the base route */
    set baseComponent(value) { this._baseComponent = value; }

    // prettier-ignore
    /** @returns {ComponentOptions} */
    get editComponent() { return this._editComponent; }
    // prettier-ignore
    /** @param {ComponentOptions} value component of the route */
    set editComponent(value) { this._editComponent = value; }

    // prettier-ignore
    /** @returns {ComponentOptions} */
    get showComponent() { return this._showComponent; }
    // prettier-ignore
    /** @param {ComponentOptions} value component of the route */
    set showComponent(value) { this._showComponent = value; }

    // prettier-ignore
    /** @returns {ComponentOptions} */
    get overviewComponent() { return this._overviewComponent; }
    // prettier-ignore
    /** @param {ComponentOptions} value component of the route */
    set overviewComponent(value) { this._overviewComponent = value; }

    // prettier-ignore
    /** @returns {ComponentOptions} */
    get createComponent() { return this._createComponent; }
    // prettier-ignore
    /** @param {ComponentOptions} value component of the route */
    set createComponent(value) { this._createComponent = value; }

    /** @returns {String} */
    get editTitle() {
        if (this._editTitle) return this._editTitle;
        this._showTitle = `${this._translationService.getCapitalizedSingular(this.baseName)} aanpassen`;
        return this._editTitle;
    }

    // prettier-ignore
    /** @param {String} value title of the route */
    set editTitle(value) { this._editTitle = value; }

    /** @returns {String} */
    get showTitle() {
        if (this._showTitle) return this._showTitle;
        this._showTitle = `${this._translationService.getCapitalizedSingular(this.baseName)} bekijken`;
        return this._showTitle;
    }

    // prettier-ignore
    /** @param {String} value title of the route */
    set showTitle(value) { this._showTitle = value; }

    /** @returns {String} */
    get createTitle() {
        if (this._createTitle) return this._createTitle;
        this._createTitle = `${this._translationService.getCapitalizedSingular(this.baseName)} aanmaken`;
        return this._createTitle;
    }

    // prettier-ignore
    /** @param {String} value title of the route */
    set createTitle(value) { this._createTitle = value; }

    /** @returns {String} */
    get overviewTitle() {
        if (this._overviewTitle) return this._overviewTitle;
        this._overviewTitle = `${this._translationService.getCapitalizedPlural(this.baseName)} overzicht`;
        return this._overviewTitle;
    }

    // prettier-ignore
    /** @param {String} value title of the route */
    set overviewTitle(value) { this._overviewTitle = value; }

    // prettier-ignore
    /** @returns {RouteConfig[]} */
    get createChildren() { return this._createChildren; }
    // prettier-ignore
    /** @param {RouteConfig[]} value child routes */
    set createChildren(value) { this._createChildren = value; }

    // prettier-ignore
    /** @returns {RouteConfig[]} */
    get editChildren() { return this._editChildren; }
    // prettier-ignore
    /** @param {RouteConfig[]} value child routes */
    set editChildren(value) { this._editChildren = value; }

    // prettier-ignore
    /** @returns {RouteConfig[]} */
    get showChildren() { return this._showChildren; }
    // prettier-ignore
    /** @param {RouteConfig[]} value child routes */
    set showChildren(value) { this._showChildren = value; }

    // prettier-ignore
    /** @returns {RouteConfig[]} */
    get overviewChildren() { return this._overviewChildren; }
    // prettier-ignore
    /** @param {RouteConfig[]} value child routes */
    set overviewChildren(value) { this._overviewChildren = value; }

    /**
     * create new instance of router settings with the base route name set
     *
     * @param {String} baseRouteName the name of the base route
     * @return {RouteSettings}
     */
    createNew(baseRouteName) {
        const newInstance = new RouteSettings(this._translationService);
        newInstance.baseName = baseRouteName;
        newInstance.basePath = '/' + this._translationService.getPlural(baseRouteName);
        return newInstance;
    }
}

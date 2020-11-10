'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vueRouter = require('vue-router');
var vue = require('vue');

/**
 * @typedef {import("vue").App} App
 * @typedef {import('../http').HTTPService} HTTPService
 * @typedef {import('../http').ResponseMiddleware} ResponseMiddleware
 * @typedef {import('../http').ResponseErrorMiddleware} ResponseErrorMiddleware
 */

class EventService {
    /**
     *
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(httpService) {
        this._app;
        this._httpService = httpService;

        this._httpService.registerResponseMiddleware(this.responseMiddleware);
        this._httpService.registerResponseErrorMiddleware(this.responseErrorMiddleware);
    }

    // prettier-ignore
    /** @returns {App} */
    get app() { return this._app; }

    set app(app) {
        // if (!app.$bvToast) {
        //     Vue.use(ToastPlugin);
        // }

        // if (!app.$bvModal) {
        //     Vue.user(ModalPlugin);
        // }
        this._app = app;
    }

    /** @returns {ResponseMiddleware} */
    get responseMiddleware() {
        return ({data}) => {
            if (data && data.message) this.successToast(data.message);
        };
    }

    /** @returns {ResponseErrorMiddleware} */
    get responseErrorMiddleware() {
        return ({response}) => {
            if (response && response.data.message) this.dangerToast(response.data.message);
        };
    }

    /**
     * pops up a toast with given message in the given variance
     * @param {String} message the message being shown by the toast
     * @param {String} variant the toast variant
     */
    toast(message, variant) {
        // TODO :: vue-3 :: make toast great again
        console.log('TOAST', message, variant);
        // this._app.$bvToast.toast(`${message}`, {
        //     variant,
        //     solid: true,
        //     toaster: 'b-toaster-bottom-left',
        // });
    }

    /**
     * pops up a success toast
     * @param {String} message the message being shown by the toast
     */
    successToast(message) {
        this.toast(message, 'success');
    }

    /**
     * pops up a danger toast
     * @param {String} message the message being shown by the toast
     */
    dangerToast(message) {
        this.toast(message, 'danger');
    }

    /**
     * pops up a modal with the given message
     * @param {String} message the message being shown by the modal
     * @param {Function} okAction the function being used when click on ok
     * @param {Function} [cancelAction] the being used when click on cancel
     */
    modal(message, okAction, cancelAction) {
        // TODO :: vue-3 :: make modal great again
        console.log('MODAL', message, okAction, cancelAction);
        // this._app.$bvModal
        //     .msgBoxConfirm(message, {
        //         size: 'm',
        //         buttonSize: 'm',
        //         okVariant: 'primary',
        //         okTitle: 'Ja',
        //         cancelTitle: 'Nee',
        //         headerClass: 'p-2',
        //         footerClass: 'p-2 confirm',
        //         hideHeaderClose: true,
        //         centered: true,
        //     })
        //     .then(value => {
        //         if (value && okAction) okAction();
        //         else if (cancelAction) cancelAction();
        //     });
    }
}

class MissingTranslationError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        this.name = 'MissingTranslationError';
    }
}

/**
 * @typedef {Object} Translation
 * @property {string} singular the singular translation
 * @property {string} plural the plural translation
 *
 * @typedef {import('../../errors/MissingTranslationError').MissingTranslationError} MissingTranslationError
 */

const PLURAL = 'plural';
const SINGULAR = 'singular';

/**
 * Capitalize the give value
 * @param {String} value
 */
const capitalize = value => `${value[0].toUpperCase()}${value.substr(1)}`;

class TranslatorService {
    constructor() {
        /**
         * @type {Object.<string, Translation>}
         * @private
         */
        this._translations = {};
    }

    /**
     * Get plural or singular translation for given value
     *
     * @param {String} value
     * @param {PLURAL | SINGULAR} pluralOrSingular
     *
     * @throws {MissingTranslationError}
     * @private
     */
    _getTranslation(value, pluralOrSingular) {
        const translation = this._translations[value];

        if (!translation) throw new MissingTranslationError(`Missing translation for ${value}`);
        if (!translation[pluralOrSingular]) {
            throw new MissingTranslationError(`Missing ${pluralOrSingular} translation for ${value}`);
        }

        return translation[pluralOrSingular];
    }

    /**
     * Get the plural translation for the given value
     *
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    getPlural(value) {
        return this._getTranslation(value, PLURAL);
    }

    /**
     * Get the singular translation for the given value
     *
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    getSingular(value) {
        return this._getTranslation(value, SINGULAR);
    }

    /**
     * Get the singular translation for the given value and capitalize it
     *
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    getCapitalizedSingular(value) {
        return capitalize(this.getSingular(value));
    }

    /**
     * Get the plural translation for the given value and capitalize it
     *
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    getCapitalizedPlural(value) {
        return capitalize(this.getPlural(value));
    }

    /**
     * Get the either the singular or plural translation, based on the given count
     * Return the string `${count} ${translation}`
     *
     * @param {Number} count
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    maybePluralize(count, value) {
        const baseString = `${count} `;
        if (count == 1) return baseString + this.getSingular(value);
        return baseString + this.getPlural(value);
    }

    /**
     * @param {string} key
     * @param {Translation} translation
     */
    setTranslation(key, translation) {
        this._translations[key] = translation;
    }
}

class RouterConsumedError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        this.name = 'RouterConsumedError';
    }
}

/**
 * @typedef {import("vue-router").RouteRecord} RouteRecord
 * @typedef {import("vue-router").NavigationGuard} NavigationGuard
 * @typedef {import("vue-router").NavigationHookAfter} NavigationHookAfter
 * @typedef {import('vue-router').RouteLocation} RouteLocation
 * @typedef {import('vue-router').LocationQuery} LocationQuery
 *
 * @typedef {import("./factory").RouteFactory} RouteFactory
 * @typedef {import("./settings").RouteSettings} RouteSettings
 */

const router = vueRouter.createRouter({
    history: vueRouter.createWebHistory(),
    routes: [],
});

/**
 * checks if the given string is in the current routes name
 * @param {string} pageName the name of the page to check
 */
const onPage = pageName => router.currentRoute.value.name.includes(pageName);

class RouterService {
    /**
     * @param {RouteFactory} factory the router factory
     * @param {RouteSettings} settings the settings service for the routes
     */
    constructor(factory, settings) {
        this._router = router;
        this._factory = factory;
        this._settings = settings;

        /** @type {NavigationGuard[]} */
        this._routerBeforeMiddleware = [this.beforeMiddleware];
        router.beforeEach((to, from, next) => {
            for (const middlewareFunc of this._routerBeforeMiddleware) {
                // MiddlewareFunc will return true if it encountered problems
                if (middlewareFunc(to, from, next)) return next(false);
            }
            return next();
        });

        /** @type {NavigationHookAfter[]} */
        this._routerAfterMiddleware = [];
        router.afterEach((to, from) => {
            for (const middlewareFunc of this._routerAfterMiddleware) {
                middlewareFunc(to, from);
            }
        });
    }

    /** router can only be consumed once, which will happen at the appstarter */
    get router() {
        if (!this._router) {
            throw new RouterConsumedError('You may not acces the router directly!');
        }
        const onceRouter = this._router;
        this._router = undefined;
        return onceRouter;
    }

    /**
     * register middleware for the router before entering the route
     * @param {BeforeMiddleware} middlewareFunc the middleware function
     */
    registerBeforeMiddleware(middlewareFunc) {
        this._routerBeforeMiddleware.push(middlewareFunc);
    }

    /**
     * register middleware for the router after entering a route
     * @param {AfterMiddleware} middlewareFunc the middleware function
     */
    registerAfterMiddleware(middlewareFunc) {
        this._routerAfterMiddleware.push(middlewareFunc);
    }

    // prettier-ignore
    /**
     * Add routes to the router
     * @param {RouteRecord[]} routes
     */
    addRoutes(routes) {router.options.routes.push(routes);}

    /**
     * Go to the give route by name, optional id and query
     * If going to a route you are already on, it catches the given error
     *
     * @param {String} name the name of the new route
     * @param {String} [id] the optional id for the params of the new route
     * @param {LocationQuery} [query] the optional query for the new route
     */
    goToRoute(name, id, query) {
        if (onPage(name) && !query && !id) return;

        /** @type {RouteLocation} */
        const route = {name};
        if (id) route.params = {id};
        if (query) route.query = query;

        router.push(route).catch(err => {
            // TODO :: vue-3 :: check if NavigationDuplicated error is still the same name
            // Ignore the vue-router err regarding navigating to the page they are already on.
            if (err && err.name != 'NavigationDuplicated') {
                // But print any other errors to the console
                console.error(err);
            }
        });
    }

    /**
     * create basic routes for the given settings
     *
     * @param {RouteSettings} settings the settings on which the routes are based
     */
    createRoutes(settings) {
        const routes = [];

        if (settings.overviewComponent) {
            routes.push(this._factory.createOverview(settings));
        }

        if (settings.createComponent) {
            routes.push(this._factory.createCreate(settings));
        }

        if (settings.showComponent) {
            routes.push(this._factory.createShow(settings));
        }

        if (settings.editComponent) {
            routes.push(this._factory.createEdit(settings));
        }

        return [this._factory.createBase(settings, routes)];
    }

    /**
     * Create new route settings
     *
     * @param {String} baseRouteName the base name for the routes being created
     *
     * @returns {RouteSettings}
     */
    newSettings(baseRouteName) {
        return this._settings.createNew(baseRouteName);
    }

    /** @returns {NavigationGuard} */
    get beforeMiddleware() {
        return (to, from) => {
            const fromQuery = from.query.from;
            if (fromQuery) {
                if (fromQuery == to.fullPath) return false;
                router.push(from.query.from);
                return true;
            }
            return false;
        };
    }

    // prettier-ignore
    /** returns if you are on the create page */
    get onCreatePage() { return onPage(this._settings.createPageName); }
    // prettier-ignore
    /** returns if you are on the edit page */
    get onEditPage() { return onPage(this._settings.editPageName); }
    // prettier-ignore
    /** returns if you are on the show page */
    get onShowPage() { return onPage(this._settings.showPageName); }
    // prettier-ignore
    /** returns if you are on the overview page */
    get onOverviewPage() { return onPage(this._settings.overviewPageName); }
    // prettier-ignore
    /** Get the query from the current route */
    get query() { return router.currentRoute.query; }
    // prettier-ignore
    /** Get the id from the params from the current route */
    get id() { return router.currentRoute.params.id; }

    // prettier-ignore
    /** Get the name from the current route */
    get currentRouteName() { return router.currentRoute.name; }
}

/**
 * @typedef {import('../settings').RouteSettings} RouteSettings
 * @typedef {import('vue-router').RouteConfig} RouteConfig
 */

class RouteFactory {
    /**
     * Create the base for the routes based on the settings and add the children to it
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     * @param {RouteConfig[]} children
     *
     * @returns {RouteConfig}
     */
    createBase(settings, children) {
        return this.createConfigWithChildren(settings.basePath, settings.baseComponent, children);
    }

    /**
     * Create a standard route config
     *
     * @param {String} path the name of the path for the route config
     * @param {String} name the name of the route
     * @param {*} component the component to render for this route
     * @param {Boolean} auth if you need to be authenticated to see this route
     * @param {Boolean} admin if you need to be admin to see the route
     * @param {String} title the title of the route
     * @param {Boolean} [cantSeeWhenLoggedIn] if the page cant be seen when logged in, default = false
     *
     * @returns {RouteConfig}
     */
    createConfig(path, name, component, auth, admin, title, cantSeeWhenLoggedIn = false) {
        return {
            path,
            name,
            component,
            meta: {auth, admin, title, cantSeeWhenLoggedIn},
        };
    }

    /**
     * Create a standard route config with child routes
     *
     * @param {String} path the name of the path for the route config
     * @param {*} component the component to render for this route
     * @param {RouteConfig[]} children the child routes
     *
     * @returns {RouteConfig}
     */
    createConfigWithChildren(path, component, children) {
        return {path, component, children};
    }

    /**
     * Create an overview route for the given settings
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     *
     * @returns {RouteConfig}
     */
    createOverview(settings) {
        return this.createConfig(
            settings.overviewPath,
            settings.overviewName,
            settings.overviewComponent,
            settings.overviewPageAuthOnly,
            settings.overviewPageAdminOnly,
            settings.overviewTitle
        );
    }

    /**
     * Create a create route for the given settings
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     *
     * @returns {RouteConfig}
     */
    createCreate(settings) {
        return this.createConfig(
            settings.createPath,
            settings.createName,
            settings.createComponent,
            settings.createPageAuthOnly,
            settings.createPageAdminOnly,
            settings.createTitle
        );
    }

    /**
     * Create a create route for the given settings
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     *
     * @returns {RouteConfig}
     */
    createShow(settings) {
        if (settings.showChildren) {
            return this.createConfigWithChildren(settings.showPath, settings.showComponent, settings.showChildren);
        }

        return this.createConfig(
            settings.showPath,
            settings.showName,
            settings.showComponent,
            settings.showPageAuthOnly,
            settings.showPageAdminOnly,
            settings.showTitle
        );
    }

    /**
     * Create a create route for the given settings
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     *
     * @returns {RouteConfig}
     */
    createEdit(settings) {
        return this.createConfig(
            settings.editPath,
            settings.editName,
            settings.editComponent,
            settings.editPageAuthOnly,
            settings.editPageAdminOnly,
            settings.editTitle
        );
    }
}

/**
 * @typedef {import('../../translator').TranslatorService} TranslatorService
 * @typedef {import('vue').ComponentOptions} ComponentOptions
 * @typedef {import('vue-router').RouteConfig} RouteConfig
 */

class RouteSettings {
    /**
     *
     * @param {TranslatorService} translationService
     */
    constructor(translationService) {
        this._translationService = translationService;

        /** route names */
        this._baseName;
        this._editName;
        this._showName;
        this._overviewName;
        this._createName;

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
    /** returns the create name part of the route */
    get createPageName() { return '.create'; }

    // prettier-ignore
    /** returns the edit name part of the route */
    get editPageName() { return '.edit'; }

    // prettier-ignore
    /** returns the overview name part of the route */
    get overviewPageName() { return '.overview'; }

    // prettier-ignore
    /** returns the show name part of the route */
    get showPageName() { return '.show'; }

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
    get baseName() { return this._baseName; }
    // prettier-ignore
    /** @param {String} value name of the base route */
    set baseName(value) { this._baseName = value; }

    /** @returns {String} */
    get editName() {
        if (this._editName) return this._editName;
        this._editName = this._baseName + this.editPageName;
        return this._editName;
    }

    // prettier-ignore
    /** @param {String} value name of the route */
    set editName(value) { this._editName = value; }

    /** @returns {String} */
    get showName() {
        if (this._showName) return this._showName;
        this._showName = this._baseName + this.showPageName;
        return this._showName;
    }

    // prettier-ignore
    /** @param {String} value name of the route */
    set showName(value) { this._showName = value; }

    /** @returns {String} */
    get createName() {
        if (this._createName) return this._createName;
        this._createName = this._baseName + this.createPageName;
        return this._createName;
    }

    // prettier-ignore
    /** @param {String} value name of the route */
    set createName(value) { this._createName = value; }

    /** @returns {String} */
    get overviewName() {
        if (this._overviewName) return this._overviewName;
        this._overviewName = this._baseName + this.overviewPageName;
        return this._overviewName;
    }

    // prettier-ignore
    /** @param {String} value name of the route */
    set overviewName(value) { this._overviewName = value; }

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

/**
 * @typedef {import('../../http').HTTPService} HTTPService
 * @typedef {import('../../storage').StorageService} StorageService
 */

// TODO :: documentation

class BaseStoreModule {
    /**
     * @param {String} endpoint the endpoint
     * @param {StorageService} storageService the storage service for storing stuff in the browser
     * @param {HTTPService} httpService the service that makes the requests
     */
    constructor(endpoint, httpService, storageService) {
        this._endpoint = endpoint;
        this._httpService = httpService;
        this._storageService = storageService;

        // Check if data is stored, if so load that, else empty
        const stored = this._storageService.getItem(endpoint);
        this._state = vue.ref(stored ? JSON.parse(stored) : {});
    }

    // getters
    get all() {
        return vue.computed(() => {
            const data = this._state.value;
            // if data is not of type object, return as is
            if (typeof data !== 'object') return data;

            // if not all keys are a number, then return as is
            if (Object.keys(data).some(key => isNaN(key))) return data;

            return Object.values(data);
        });
    }

    byId(id) {
        return this.all[id];
    }

    // mutations
    setAll(data) {
        if (!data.length) {
            // if data is not an array but the state contains an array
            // then data probably has an id and then you can set it in the state
            if (this._state.value.length && data.id) {
                // TODO :: vue-3 :: check if vue-3 is reactive this way
                this._state.value[data.id] = data;
            } else {
                // else put data as the state
                this._state.value = data;
            }
        } else if (data.length === 1) {
            // if data has an array with 1 entry, put it in the state
            this._state.value[data[0].id] = data[0];
        } else {
            // if data has more entries, then that's the new baseline
            for (const id in this._state.value) {
                // search for new data entry
                const newDataIndex = data.findIndex(entry => entry.id == id);
                // if not found, then delete entry
                if (newDataIndex === -1) {
                    // TODO :: vue-3 :: check if vue-3 is reactive this way
                    delete this._state.value[id];
                    continue;
                }
                // remove new entry from data, so further searches speed up
                const newData = data.splice(newDataIndex, 1)[0];

                // if the entry for this id is larger then the current entry, do nothing
                if (Object.values(this._state.value[id]).length > Object.values(newData).length) continue;

                this._state.value[newData.id] = newData;
            }

            // put all remaining new data in the state
            for (const newData of data) {
                this._state.value[newData.id] = newData;
            }
        }

        this._storageService.setItem(this._endpoint, JSON.stringify(this._state.value));
    }

    deleteEntryById(id) {
        delete this._state.value[id];
        this._storageService.setItem(this._endpoint, JSON.stringify(this._state.value));
    }

    // actions
    get(id) {
        return this._httpService.get(this._endpoint + (id ? `/${id}` : ''));
    }

    post(item) {
        return this._httpService.post(this._endpoint + (item.id ? `/${item.id}` : ''), item);
    }

    delete(id) {
        return this._httpService.delete(`${this._endpoint}/${id}`);
    }
}

/**
 * @typedef {import('../../http').HTTPService} HTTPService
 * @typedef {import('../../storage').StorageService} StorageService
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

class StoreModuleFactory {
    /**
     * @param {HTTPService} httpService the http service for communication with the API
     * @param {StorageService} storageService the storage service for storing stuff in the browser
     */
    constructor(httpService, storageService) {
        this._httpService = httpService;
        this._storageService = storageService;
    }

    /**
     * Generate a default store module
     * @param {String} [endpoint] the optional endpoint for the API
     */
    createDefaultStore(endpoint) {
        // TODO :: make a base store module, which has only a state
        // and make a EndpointStoreModule, which extends the base and adds httpService actions
        return new BaseStoreModule(endpoint, this._httpService, this._storageService);
    }
}

class StoreModuleNotFoundError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        this.name = 'StoreModuleNotFoundError';
    }
}

/**
 * @typedef {import('./factory').StoreModuleFactory} StoreModuleFactory
 * @typedef {import('../http').HTTPService} HTTPService
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 *
 * @typedef {import('../../errors/StoreModuleNotFoundError').StoreModuleNotFoundError} StoreModuleNotFoundError
 * @typedef {import('../../controllers').Item} Item
 * @typedef {import('./factory/module').BaseStoreModule} BaseStoreModule
 *
 * @typedef {Object<string,BaseStoreModule>} Store
 */

// const store = {}

// export default {}

class StoreService {
    /**
     * @param {StoreModuleFactory} factory the factory being used to create store modules
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(factory, httpService) {
        /** @type {Store} */
        this._store = {};
        this._factory = factory;
        this._httpService = httpService;

        /** @type {String[]} */
        this._moduleNames = [];

        this._httpService.registerResponseMiddleware(this.responseMiddleware);
    }

    /**
     * The store service response middleware checks if any of the known modulenames is in the data of the response
     * When there is a modulename in the response it dispatches an action to that module to set the response data in the store
     */
    get responseMiddleware() {
        return ({data}) => {
            if (!data) return;
            for (const storeModuleName of this._moduleNames) {
                if (data[storeModuleName]) {
                    this.setAllInStore(storeModuleName, data[storeModuleName]);
                }
            }
        };
    }

    /**
     * get something from the store
     *
     * @param {String} moduleName the name of the module to get something from
     * @param {String} getter the name of the getter
     */
    get(moduleName, getter) {
        this.checkIfRequestedModuleExists(moduleName);
        // TODO :: check if this works
        return this._store[moduleName][getter];
    }

    /**
     * dispatch an action to the store
     *
     * @param {String} moduleName the name of the module to dispatch the action to
     * @param {String} action the name of the action
     * @param {*} payload the payload to sent to the action
     */
    dispatch(moduleName, action, payload) {
        return this._store[moduleName][action](payload);
    }

    /**
     * Get all from data from the given store module
     *
     * @param {String} moduleName the module from which to get all
     *
     * @returns {Item[]}
     */
    getAllFromStore(moduleName) {
        this.checkIfRequestedModuleExists(moduleName);
        return this._store[moduleName].all;
    }

    /**
     * Get all data from the given store module by id
     *
     * @param {String} moduleName the module from which to get all
     * @param {String} id the id of the data object to get
     *
     * @return {Item}
     */
    getByIdFromStore(moduleName, id) {
        this.checkIfRequestedModuleExists(moduleName);
        return this._store[moduleName].byId(id);
    }

    /**
     * dispatch an action to the store, which deletes an item on the server
     *
     * @param {String} moduleName the store module for which an item must be deleted
     * @param {String} id the id of the item to be deleted
     */
    destroy(moduleName, id) {
        return this._store[moduleName].delete(id).then(response => {
            this._store[moduleName].deleteEntryById(id);
            return response;
        });
    }

    /**
     * dispatch an action to the store, which updates an item on the server
     *
     * @param {String} moduleName the store module for which an item must be updated
     * @param {Item} item the item to be updated
     */
    update(moduleName, item) {
        return this._store[moduleName].post(item);
    }

    /**
     * dispatch an action to the store, which creates an item on the server
     *
     * @param {String} moduleName the store module for which an item must be created
     * @param {Item} item the item to be created
     */
    create(moduleName, item) {
        return this._store[moduleName].post(item);
    }

    /**
     * dispatch an action to the store, which reads all items on the server
     *
     * @param {String} moduleName the store module for which all items must be read
     */
    read(moduleName) {
        return this._store[moduleName].get();
    }

    /**
     * dispatch an action to the store, which reads an item on the server
     *
     * @param {String} moduleName the store module for which the item must be read
     * @param {Number} id the id to be read
     */
    show(moduleName, id) {
        return this._store[moduleName].get(id);
    }

    /**
     * Set all the data in the store module
     *
     * @param {String} moduleName the module to fill the data with
     * @param {Item | Item[]} data data to fill the store with
     */
    setAllInStore(moduleName, data) {
        return this._store[moduleName].setAll(data);
    }

    /**
     * generate and set the default store module in the store
     *
     * @param {String} moduleName the name of the module
     * @param {String} [endpoint] the endpoint for the API
     * @param {Object<string,Function>} [extraFunctionality] extra functionality added to the store
     */
    generateAndSetDefaultStoreModule(moduleName, endpoint, extraFunctionality) {
        // TODO :: mixin for etraFunctionality?
        const storeModule = this._factory.createDefaultStore(endpoint);

        if (extraFunctionality) {
            for (const name in extraFunctionality) {
                storeModule[name] = extraFunctionality[name];
            }
        }

        this.registerModule(moduleName, storeModule);
    }

    /**
     * set the store module in the store
     *
     * @param {String} moduleName the name of the module
     * @param {Module} storeModule the module to add to the store
     */
    registerModule(moduleName, storeModule) {
        this._moduleNames.push(moduleName);
        this._store[moduleName] = storeModule;
    }

    /**
     * Checks if requested module exists in the store
     * If not, throws a StoreModuleNotFoundError
     *
     * @param {String} moduleName
     *
     * @throws {StoreModuleNotFoundError}
     */
    checkIfRequestedModuleExists(moduleName) {
        if (this._moduleNames.indexOf(moduleName) !== -1) return;

        throw new StoreModuleNotFoundError(
            `Could not find ${moduleName}, only these modules exists at the moment: ${this._storeService._moduleNames.toString()}`
        );
    }
}

/**
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../http').HTTPService} HTTPService
 */
let msgpack;
/**
 * Gives a warning in webpack, check this issue: https://github.com/webpack/webpack/issues/7713
 * this is the way to go for now
 *
 * to ignore this error, add the following webpack config in webpack.config.js:
 * {externals: {'@msgpack/msgpack': true}}
 *
 * or when using 'laravel-mix', the following to webpack.mix.js:
 * mix.webpackConfig({externals: {'@msgpack/msgpack': 'msgpack'}});
 */
try {
    msgpack = require('@msgpack/msgpack');
    // eslint-disable-next-line
} catch (error) {}

const MSG_PACK_DATA_TYPE = 'msg-pack';

class StaticDataService {
    /**
     * @param {StoreService} storeService
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(storeService, httpService) {
        this._storeService = storeService;
        this._httpService = httpService;

        this._data = {
            normal: [],
            msgpack: [],
        };

        this._apiStaticDataEndpoint = 'staticdata';
    }
    /**
     * initiates the setup for the default store modules
     *
     * @param {[string,Object<string,string>]} data Modulenames
     */
    createStoreModules(data) {
        for (const moduleName of data) {
            if (typeof moduleName == 'string') {
                this.createStoreModule(moduleName);
            } else if (typeof moduleName == 'object' && Object.values(moduleName) == MSG_PACK_DATA_TYPE) {
                this.createStoreModuleMsgPack(Object.keys(moduleName).toString());
            }
        }
    }

    /**
     * Creates and registers modules for the staticdata
     *
     * @param {string} storeModuleName Modulenames
     */
    createStoreModule(storeModuleName) {
        this._data.normal.push(storeModuleName);

        this._storeService.generateAndSetDefaultStoreModule(storeModuleName);
    }

    /**
     * Create module for static data with msg-pack lite(peerDependencies)
     *
     * @param {string} storeModuleName Modulenames
     */
    createStoreModuleMsgPack(storeModuleName) {
        if (!msgpack) {
            console.error('MESSAGE PACK NOT INSTALLED');
            return console.warn('run the following command to install messagepack: npm --save @msgpack/msgpack');
        }
        this._data.msgpack.push(storeModuleName);

        const storeModule = this._storeService._factory.createDefaultStore(storeModuleName);
        storeModule.actions[this._storeService._factory.readAction] = () =>
            this._httpService.get(storeModuleName, {responseType: 'arraybuffer'}).then(response => {
                this._storeService.setAllInStore(storeModuleName, msgpack.decode(new Uint8Array(response.data)));
                return response;
            });
        this._storeService.registerModule(storeModuleName, storeModule);
    }

    /**
     * Sends an action to the store which reads all the staticdata from the server defined in the 'constants/staticdata.js' file
     */
    getStaticData() {
        this._httpService.get(this._apiStaticDataEndpoint);

        for (const staticDataName of this._data.msgpack) {
            this._storeService.read(staticDataName);
        }
    }

    /**
     * Get all from data from the given store module
     *
     * @param {String} data the module from which to get all
     */
    getAll(data) {
        return this._storeService.getAllFromStore(data);
    }

    /**
     * Get all data from the given store module by id
     *
     * @param {String} data the module from which to get all
     * @param {Number} id the id of the data object to get
     */
    getById(data, id) {
        return this._storeService.getByIdFromStore(data, id);
    }
}

const APP_NAME = process.env.MIX_APP_NAME || 'Harry';

const IS_LOGGED_IN = APP_NAME + ' is magical';
const IS_ADMIN = APP_NAME + ' is supreme';
const LOGGED_IN_USER = APP_NAME + ' is Harry';

var storeModule = (storageService, httpService, authService) => {
    return {
        namespaced: true,
        state: {
            isLoggedIn: !!storageService.getItem(IS_LOGGED_IN),
            isAdmin: !!storageService.getItem(IS_ADMIN),
            pending: false,
            loggedInUser: storageService.getItem(LOGGED_IN_USER, true) || {},
            // userToRegister: {}, // move to register service
        },
        getters: {
            isLoggedIn: state => state.isLoggedIn,
            isAdmin: state => state.isAdmin,
            loggedInUser: state => state.loggedInUser,
            // getUserToRegister: state => state.userToRegister,// move to register service
        },
        mutations: {
            LOGIN: state => (state.pending = true),
            LOGIN_SUCCES: state => {
                state.pending = false;
                state.isLoggedIn = true;
                storageService.setItem(IS_LOGGED_IN, state.isLoggedIn);
            },
            LOGOUT: _ => {
                storageService.clear();
                // TODO :: or reload state? transition from this is not rly smooth
                window.location.reload(false);
            },
            SET_ADMIN: (state, isAdmin) => {
                state.isAdmin = isAdmin;
                storageService.setItem(IS_ADMIN, isAdmin);
            },
            SET_LOGGED_IN_USER: (state, user) => {
                state.loggedInUser = user;
                storageService.setItem(LOGGED_IN_USER, JSON.stringify(user));
            },
            // SET_USER_TO_REGISTER: (state, payload) => (state.userToRegister = payload),// move to register service
        },
        actions: {
            login: ({commit}, payload) => {
                storageService.keepALive = payload.rememberMe;
                commit('LOGIN');
                return httpService.post(authService.apiLoginRoute, payload).then(response => {
                    commit('LOGIN_SUCCES');
                    const user = response.data.user;
                    if (user) commit('SET_LOGGED_IN_USER', user);
                    const isAdmin = response.data.isAdmin;
                    // After login admin can never be set to false
                    if (isAdmin) commit('SET_ADMIN', isAdmin);
                    return response;
                });
            },
            logout: ({commit}) => {
                return httpService.post(authService.apiLogoutRoute).then(response => {
                    commit('LOGOUT');
                    return response;
                });
            },

            logoutApp: ({commit}) => commit('LOGOUT'),

            sendEmailResetPassword: (_, email) => {
                return httpService.post(authService.apiSendEmailResetPasswordRoute, {email}).then(response => {
                    if (response.status == 200) authService.goToLoginPage();
                });
            },

            resetPassword: (_, data) => {
                return httpService.post(authService.apiResetpasswordRoute, data).then(authService.goToLoginPage());
            },

            me: ({commit}) => {
                return httpService.get(authService.apiLoggedInCheckRoute).then(response => {
                    const user = response.data.user;
                    if (user) commit('SET_LOGGED_IN_USER', user);
                    const isAdmin = response.data.isAdmin;
                    // After login admin can never be set to false
                    if (isAdmin) commit('SET_ADMIN', isAdmin);
                    return response;
                });
            },
        },
    };
};

var LoginPage = {
    render(h) {
        h('div', ['Implement your own login page!']);
    },
};

var ForgotPasswordPage = {
    render(h) {
        h('div', ['Implement your own forgot password page!']);
    },
};

var ResetPasswordPage = {
    render(h) {
        h('div', ['Implement your own reset password page!']);
    },
};

class MissingDefaultLoggedinPageError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        this.name = 'MissingDefaultLoggedinPageError';
    }
}

/**
 * @typedef {import('../router').RouterService} RouterService
 * @typedef {import('../router').BeforeMiddleware} BeforeMiddleware
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../storage').StorageService} StorageService
 * @typedef {import('../http').HTTPService} HTTPService
 * @typedef {import('../http').ResponseErrorMiddleware} ResponseErrorMiddleware

 * @typedef {import('vue').Component} Component
 *
 * @typedef {Object} Credentials
 * @property {String} email the email to login with
 * @property {String} password the password to login with
 * @property {Boolean} rememberMe if you want a consistent login
 *
 * @typedef {Object} ResetPasswordData
 * @property {String} password
 * @property {String} repeatPassword
 */

const LOGIN_ACTION = 'login';
const LOGOUT_ACTION = 'logout';

const LOGIN_ROUTE_NAME = 'Login';
const FORGOT_PASSWORD_ROUTE_NAME = 'ForgotPassword';
const RESET_PASSWORD_ROUTE_NAME = 'ResetPassword';
const SET_PASSWORD_ROUTE_NAME = 'SetPassword';

const STORE_MODULE_NAME = 'auth';

class AuthService {
    /**
     * @param {RouterService} routerService
     * @param {StoreService} storeService
     * @param {StorageService} storageService
     * @param {HTTPService} httpService
     */
    constructor(routerService, storeService, storageService, httpService) {
        this._routerService = routerService;
        this._storeService = storeService;
        this._storageService = storageService;
        this._httpService = httpService;

        this._storeService.registerModule(STORE_MODULE_NAME, storeModule(storageService, httpService, this));

        this._apiLoginRoute = '/login';
        this._apiLogoutRoute = '/logout';
        this._apiLoggedInCheckRoute = '/me';
        this._apiSendEmailResetPasswordRoute = '/send-email-reset-password';
        this._apiResetpasswordRoute = '/resetpassword';

        this._defaultLoggedInPageName;
        this._loginPage = LoginPage;
        this._forgotPasswordPage = ForgotPasswordPage;
        this._resetPasswordPage = ResetPasswordPage;
        this._setPasswordPage;

        this._httpService.registerResponseErrorMiddleware(this.responseErrorMiddleware);
        this._routerService.registerBeforeMiddleware(this.routeMiddleware);
    }

    get apiLoginRoute() {
        return this._apiLoginRoute;
    }

    set apiLoginRoute(route) {
        if (!route.startsWith('/')) route = '/' + route;
        this._apiLoginRoute = route;
    }

    get apiLogoutRoute() {
        return this._apiLogoutRoute;
    }

    set apiLogoutRoute(route) {
        if (!route.startsWith('/')) route = '/' + route;
        this._apiLogoutRoute = route;
    }

    get apiLoggedInCheckRoute() {
        return this._apiLoggedInCheckRoute;
    }

    set apiLoggedInCheckRoute(route) {
        if (!route.startsWith('/')) route = '/' + route;
        this._apiLoggedInCheckRoute = route;
    }

    get apiSendEmailResetPasswordRoute() {
        return this._apiSendEmailResetPasswordRoute;
    }

    set apiSendEmailResetPasswordRoute(route) {
        if (!route.startsWith('/')) route = '/' + route;
        this._apiSendEmailResetPasswordRoute = route;
    }

    get apiResetpasswordRoute() {
        return this._apiResetpasswordRoute;
    }

    set apiResetpasswordRoute(route) {
        if (!route.startsWith('/')) route = '/' + route;
        this._apiResetpasswordRoute = route;
    }

    get isLoggedin() {
        // TODO :: where to set isLoggedIn?
        return this._storeService.get(STORE_MODULE_NAME, 'isLoggedIn');
    }

    // TODO :: this is not basic usage, how to implement this?
    get isAdmin() {
        // TODO :: where to set isAdmin?
        return this._storeService.get(STORE_MODULE_NAME, 'isAdmin');
    }

    get loggedInUser() {
        return this._storeService.get(STORE_MODULE_NAME, 'loggedInUser');
    }

    get defaultLoggedInPageName() {
        if (!this._defaultLoggedInPageName)
            throw new MissingDefaultLoggedinPageError('Please add the default login page to the appStarter');
        return this._defaultLoggedInPageName;
    }

    // prettier-ignore
    /** @param {string} pageName */
    set defaultLoggedInPageName(pageName){this._defaultLoggedInPageName = pageName;}

    // prettier-ignore
    get loginPage() { return this._loginPage; }

    // prettier-ignore
    /** @param {Component} page*/
    set loginPage(page) { this._loginPage = page; }

    // prettier-ignore
    get forgotPasswordPage() { return this._forgotPasswordPage; }

    // prettier-ignore
    /** @param {Component} page*/
    set forgotPasswordPage(page) { this._forgotPasswordPage = page; }

    // prettier-ignore
    get resetPasswordPage() { return this._resetPasswordPage; }

    // prettier-ignore
    /** @param {Component} page*/
    set resetPasswordPage(page) { this._resetPasswordPage = page; }

    // prettier-ignore
    get setPasswordPage() { return this._setPasswordPage; }

    // prettier-ignore
    /** @param {Component} page*/
    set setPasswordPage(page) { this._setPasswordPage = page; }

    /**
     * Login to the app
     * @param {Credentials} credentials the credentials to login with
     */
    login(credentials) {
        return this._storeService.dispatch(STORE_MODULE_NAME, LOGIN_ACTION, credentials);
    }

    logout() {
        return this._storeService.dispatch(STORE_MODULE_NAME, LOGOUT_ACTION);
    }

    /**
     * Send a reset password email to the given email
     * @param {String} email
     */
    sendEmailResetPassword(email) {
        return this._storeService.dispatch(STORE_MODULE_NAME, 'sendEmailResetPassword', email);
    }

    /**
     * @param {ResetPasswordData} data
     */
    resetPassword(data) {
        return this._storeService.dispatch(STORE_MODULE_NAME, 'resetPassword', data);
    }

    // prettier-ignore
    goToStandardLoggedInPage() { this._routerService.goToRoute(this.defaultLoggedInPageName); }

    // prettier-ignore
    goToLoginPage() { this._routerService.goToRoute(LOGIN_ROUTE_NAME); }

    // prettier-ignore
    goToForgotPasswordPage() { this._routerService.goToRoute(FORGOT_PASSWORD_ROUTE_NAME); }

    // prettier-ignore
    goToResetPasswordPage() { this._routerService.goToRoute(RESET_PASSWORD_ROUTE_NAME); }

    // prettier-ignore
    goToSetPasswordPage() { this._routerService.goToRoute(SET_PASSWORD_ROUTE_NAME); }

    /**
     * Sends a request to the server to get the logged in user
     */
    getLoggedInUser() {
        this._storeService.dispatch(STORE_MODULE_NAME, 'me');
    }

    /** @returns {ResponseErrorMiddleware} */
    get responseErrorMiddleware() {
        return ({response}) => {
            if (!response) return;
            const {status} = response;
            if (status == 403) {
                this.goToStandardLoggedInPage();
            } else if (status == 401) {
                this._storeService.dispatch(STORE_MODULE_NAME, 'logoutApp');
            }
        };
    }

    /** @returns {BeforeMiddleware} */
    get routeMiddleware() {
        return to => {
            const isLoggedIn = this.isLoggedin;
            const isAdmin = this.isAdmin;

            if (!isLoggedIn && to.meta.auth) {
                this.goToLoginPage();
                return true;
            }

            if (isLoggedIn && to.meta.cantSeeWhenLoggedIn) {
                this.goToStandardLoggedInPage();
                return true;
            }

            if (!isAdmin && to.meta.admin) {
                this.goToStandardLoggedInPage();
                return true;
            }

            return false;
        };
    }

    setRoutes() {
        const routes = [
            this._routerService._factory.createConfig(
                '/inloggen',
                LOGIN_ROUTE_NAME,
                this.loginPage,
                false,
                false,
                'Login',
                true
            ),
            this._routerService._factory.createConfig(
                '/wachtwoord-vergeten',
                FORGOT_PASSWORD_ROUTE_NAME,
                this.forgotPasswordPage,
                false,
                false,
                'Wachtwoord vergeten',
                true
            ),
            this._routerService._factory.createConfig(
                '/wachtwoord-resetten',
                RESET_PASSWORD_ROUTE_NAME,
                this.resetPasswordPage,
                false,
                false,
                'Wachtwoord resetten',
                true
            ),
        ];

        if (this.setPasswordPage) {
            routes.push(
                this._routerService._factory.createConfig(
                    '/wachtwoord-setten',
                    SET_PASSWORD_ROUTE_NAME,
                    this.setPasswordPage,
                    false,
                    false,
                    'Wachtwoord setten',
                    true
                )
            );
        }

        this._routerService.addRoutes(routes);
    }
}

// import {HTTPService} from './http';
const eventService = new EventService(httpService);
const translatorService = new TranslatorService();

const routeFactory = new RouteFactory();
const routeSettings = new RouteSettings(translatorService);
const routerService = new RouterService(routeFactory, routeSettings);

const storeFactory = new StoreModuleFactory(httpService, storageService);
const storeService = new StoreService(storeFactory, httpService);
const staticDataService = new StaticDataService(storeService, httpService);

const authService = new AuthService(routerService, storeService, storageService, httpService);

/**
 * @typedef {import('../services/router').RouterService} RouterService
 * @typedef {import('../services/event').EventService} EventService
 * @typedef {import('../services/auth').AuthService} AuthService
 * @typedef {import('../services/staticdata').StaticDataService} StaticDataService
 * @typedef {import('../controllers').BaseController} BaseController
 * @typedef {import('vue').Component} Component
 */

class AppStarter {
    /**
     * @param {RouterService} routerService
     * @param {EventService} eventService
     * @param {AuthService} authService
     * @param {StaticDataService} staticDataService
     */
    constructor(routerService, eventService, authService, staticDataService) {
        this._routerService = routerService;
        this._eventService = eventService;
        this._authService = authService;
        this._staticDataService = staticDataService;
    }

    /**
     * Start the app and set required settings
     *
     * @param {Component} mainComponent the main app component
     * @param {String} defaultLoggedInPageName the page to go to when logged in
     * @param {Component} loginPage the login page
     * @param {Object<string,BaseController>} controllers the login page
     * @param {[string,Object<string,string>]} [staticData] the static data
     */
    start(mainComponent, defaultLoggedInPageName, loginPage, controllers, staticData) {
        if (staticData) this._staticDataService.createStoreModules(staticData);

        this._authService.defaultLoggedInPageName = defaultLoggedInPageName;
        this._authService.loginPage = loginPage;
        this._authService.setRoutes();

        for (const controller in controllers) controllers[controller].init();

        this._eventService.app = vue.createApp(mainComponent);
        this._eventService.app.use(this._routerService.router);
        this._eventService.app.mount('#app');

        // TODO :: could even do this first and .then(()=>this._authService.getLoggedInUser())
        // or make it a setting
        if (this._authService.isLoggedin) this._authService.getLoggedInUser();
    }
}

const appStarter = new AppStarter(routerService, eventService, authService, staticDataService);

// export {BaseController} from './controllers';

// import MinimalRouterView from './components/MinimalRouterView';
// export {MinimalRouterView};

exports.appStarter = appStarter;
exports.authService = authService;
exports.eventService = eventService;
exports.routerService = routerService;
exports.staticDataService = staticDataService;

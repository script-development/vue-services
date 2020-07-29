import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueRouter from 'vue-router';

const keepALiveKey = 'keepALive';
/** setting keepALive here so we don't have to Parse it each time we get it */
let keepALive = JSON.parse(localStorage.getItem(keepALiveKey));

class StorageService {
    set keepALive(value) {
        localStorage.setItem(keepALiveKey, value);
        keepALive = value;
    }

    get keepALive() {
        return keepALive;
    }

    setItem(key, value) {
        if (!this.keepALive) return;
        if (typeof value !== 'string') value = JSON.stringify(value);
        localStorage.setItem(key, value);
    }

    getItem(key) {
        if (!this.keepALive) return null;
        return localStorage.getItem(key);
    }

    clear() {
        if (!this.keepALive) return;
        localStorage.clear();
    }
}

/**
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 * @typedef {import('../storage').StorageService} StorageService
 * @typedef {Object<string,number>} Cache
 */
// TODO :: heavilly dependant on webpack and laravel mix
const API_URL = process.env.MIX_APP_URL ? `${process.env.MIX_APP_URL}/api` : '/api';
const HEADERS_TO_TYPE = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'application/xlsx',
};

const CACHE_KEY = 'HTTP_CACHE';

class HTTPService {
    /**
     * @param {StorageService} storageService
     */
    constructor(storageService) {
        this._storageService = storageService;
        const storedCache = this._storageService.getItem(CACHE_KEY);
        /** @type {Cache} */
        this._cache = storedCache ? JSON.parse(storedCache) : {};
        this._cacheDuration = 10;

        this._http = axios.create({
            baseURL: API_URL,
            withCredentials: false,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        this._requestMiddleware = [];
        this._http.interceptors.request.use(request => {
            for (const middleware of this._requestMiddleware) {
                middleware(request);
            }
            return request;
        });

        this._responseMiddleware = [];
        this._responseErrorMiddleware = [];
        this._http.interceptors.response.use(
            response => {
                for (const middleware of this._responseMiddleware) {
                    middleware(response);
                }
                return response;
            },
            error => {
                if (!error.response) return Promise.reject(error);

                for (const middleware of this._responseErrorMiddleware) {
                    middleware(error);
                }
                return Promise.reject(error);
            }
        );
    }

    // prettier-ignore
    get cacheDuration() {return this._cacheDuration;}

    // prettier-ignore
    set cacheDuration(value) {this._cacheDuration = value;}

    /**
     * send a get request to the given endpoint
     * @param {String} endpoint the endpoint for the get
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    get(endpoint, options) {
        // get currentTimeStamp in seconds
        const currentTimeStamp = Math.floor(Date.now() / 1000);
        if (this._cache[endpoint] && !options) {
            // if it has been less then the cache duration since last requested this get request, do nothing
            if (currentTimeStamp - this._cache[endpoint] < this.cacheDuration) return;
        }

        return this._http.get(endpoint, options).then(response => {
            this._cache[endpoint] = currentTimeStamp;
            this._storageService.setItem(CACHE_KEY, this._cache);
            return response;
        });
    }

    /**
     * send a post request to the given endpoint with the given data
     * @param {String} endpoint the endpoint for the post
     * @param {Object.<string,*>} data the data to be send to the server
     */
    post(endpoint, data) {
        return this._http.post(endpoint, data);
    }

    /**
     * send a delete request to the given endpoint
     * @param {String} endpoint the endpoint for the get
     */
    delete(endpoint) {
        return this._http.delete(endpoint);
    }

    /**
     * download a file from the backend
     * type should be resolved automagically, if not, then you can pass the type
     * @param {String} endpoint the endpoint for the download
     * @param {String} documentName the name of the document to be downloaded
     * @param {String} [type] the downloaded document type
     */
    download(endpoint, documentName, type) {
        return this._http.get(endpoint, {responseType: 'blob'}).then(response => {
            if (!type) type = HEADERS_TO_TYPE[response.headers['content-type']];
            const blob = new Blob([response.data], {type});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = documentName;
            link.click();
            return response;
        });
    }

    registerRequestMiddleware(middlewareFunc) {
        this._requestMiddleware.push(middlewareFunc);
    }

    registerResponseMiddleware(middlewareFunc) {
        this._responseMiddleware.push(middlewareFunc);
    }

    registerResponseErrorMiddleware(middlewareFunc) {
        this._responseErrorMiddleware.push(middlewareFunc);
    }
}

/**
 * @typedef {import("vue/types/vue").Vue} VueInstance
 * @typedef {import('../http').HTTPService} HTTPService
 */

//  TODO :: it's BootstrapVue dependent
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

    /** @returns {VueInstance} */
    get app() {
        return this._app;
    }

    set app(app) {
        this._app = app;
    }

    get responseMiddleware() {
        return ({data}) => {
            if (data && data.message) this.successToast(data.message);
        };
    }

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
        this._app.$bvToast.toast(`${message}`, {
            variant,
            solid: true,
            toaster: 'b-toaster-bottom-left',
        });
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
        this._app.$bvModal
            .msgBoxConfirm(message, {
                size: 'm',
                buttonSize: 'm',
                okVariant: 'primary',
                okTitle: 'Ja',
                cancelTitle: 'Nee',
                headerClass: 'p-2',
                footerClass: 'p-2 confirm',
                hideHeaderClose: true,
                centered: true,
            })
            .then(value => {
                if (value && okAction) okAction();
                else if (cancelAction) cancelAction();
            });
    }
}

class MissingTranslationError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingTranslationError);
        }

        this.name = 'MissingTranslationError';
    }
}

/**
 * @typedef {Object} Translation
 * @property {string} singular the singular translation
 * @property {string} plural the plural translation
 */

const PLURAL = 'plural';
const SINGULAR = 'singular';

const capitalize = value => `${value[0].toUpperCase()}${value.substr(1)}`;

class TranslatorService {
    constructor() {
        /** @type {Object.<string, Translation>}*/
        this._translations = {};
    }

    getTranslation(value, pluralOrSingular) {
        const translation = this._translations[value];

        if(!translation) throw new MissingTranslationError(`Missing translation for ${value}`)
        if(!translation[pluralOrSingular]) throw new MissingTranslationError(`Missing ${pluralOrSingular} translation for ${value}`)

        return translation[pluralOrSingular];
    }

    getPlural(value) {
        return this.getTranslation(value, PLURAL);
    }

    getSingular(value) {
        return this.getTranslation(value, SINGULAR);
    }

    getCapitalizedSingular(value) {
        return capitalize(this.getSingular(value));
    }

    getCapitalizedPlural(value) {
        return capitalize(this.getPlural(value));
    }

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

/**
 * @typedef {import("vue-router").RouteConfig} RouteConfig
 * @typedef {import("vue-router").Route} Route
 * @typedef {import("vue-router").default} VueRouter
 * @typedef {import("./factory").RouteFactory} RouteFactory
 * @typedef {import("./settings").RouteSettings} RouteSettings
 */
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [],
});

/**
 * checks if the given string is in the current routes name
 * @param {string} pageName the name of the page to check
 */
const onPage = pageName => router.currentRoute.name.includes(pageName);

class RouterService {
    /**
     * @param {RouteFactory} factory the router factory
     * @param {RouteSettings} settings the settings service for the routes
     */
    constructor(factory, settings) {
        this._router = router;
        this._factory = factory;
        this._settings = settings;

        this._routerBeforeMiddleware = [this.beforeMiddleware];
        router.beforeEach((to, from, next) => {
            for (const middlewareFunc of this._routerBeforeMiddleware) {
                // MiddlewareFunc will return true if it encountered problems
                if (middlewareFunc(to, from, next)) return next(false);
            }
            return next();
        });

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
            console.error('You may not acces the router directly!');
            return;
        }
        const onceRouter = this._router;
        this._router = undefined;
        return onceRouter;
    }

    /**
     * register middleware for the router before entering the route
     * @param {Function} middlewareFunc the middleware function
     */
    registerBeforeMiddleware(middlewareFunc) {
        this._routerBeforeMiddleware.push(middlewareFunc);
    }

    /**
     * register middleware for the router after entering a route
     * @param {Function} middlewareFunc the middleware function
     */
    registerAfterMiddleware(middlewareFunc) {
        this._routerAfterMiddleware.push(middlewareFunc);
    }

    // prettier-ignore
    /**
     * Add routes to the router
     * @param {RouteConfig[]} routes
     */
    addRoutes(routes) {router.addRoutes(routes);}

    /**
     * Go to the give route by name, optional id and query
     * If going to a route you are already on, it catches the given error
     *
     * @param {String} name the name of the new route
     * @param {String} [id] the optional id for the params of the new route
     * @param {Object.<string, string>} [query] the optional query for the new route
     */
    goToRoute(name, id, query) {
        if (router.currentRoute.name === name && !query && !id) return;

        const route = {name};
        if (id) route.params = {id};
        if (query) route.query = query;

        router.push(route).catch(err => {
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

    /**
     * @returns {(to:Route, from:Route, next:any) => Boolean}
     */
    get beforeMiddleware() {
        return (to, from, next) => {
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
        return {
            path: settings.basePath,
            component: settings.baseComponent,
            children,
        };
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
     *
     * @returns {RouteConfig}
     */
    createConfig(path, name, component, auth, admin, title) {
        return {
            path,
            name,
            component,
            meta: {auth, admin, title},
        };
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

        /** show page settings */
        this._showPageAdminOnly = true;
        this._showPageAuthOnly = true;

        /** overview page settings */
        this._overviewPageAdminOnly = true;
        this._overviewPageAuthOnly = true;

        /** edit page settings */
        this._editPageAdminOnly = true;
        this._editPageAuthOnly = true;

        /** create page settings */
        this._createPageAdminOnly = true;
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
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

class StoreModuleFactory {
    /**
     * @param {HTTPService} httpService the http service for communication with the API
     * @param {StorageService} storageService the storage service for storing stuff in the browser
     * @param {Boolean} [namespaced]
     */
    constructor(httpService, storageService, namespaced = true) {
        this._httpService = httpService;
        this._storageService = storageService;
        this._namespaced = namespaced;

        // getter naming
        /** @type {String} */ this._readAllGetter;
        /** @type {String} */ this._readByIdGetter;

        // state naming
        /** @type {String} */ this._allItemsStateName;

        // mutation naming
        /** @type {String} */ this._setAllMutation;
        /** @type {String} */ this._deleteMutation;

        // action naming
        /** @type {String} */ this._readAction;
        /** @type {String} */ this._updateAction;
        /** @type {String} */ this._createAction;
        /** @type {String} */ this._deleteAction;
        /** @type {String} */ this._setAllAction;
    }

    /**
     * Generate a default store module
     * @param {String} moduleName the name of the module
     * @param {String} [endpoint] the optional endpoint for the API
     */
    createDefaultStore(moduleName, endpoint) {
        return {
            namespaced: this._namespaced,
            state: this.createDefaultState(moduleName),
            getters: this.createDefaultGetters(),
            mutations: this.createDefaultMutations(moduleName),
            actions: this.createDefaultActions(endpoint),
        };
    }

    /** create default state for the store */
    createDefaultState(moduleName) {
        const stored = this._storageService.getItem(moduleName + this.allItemsStateName);
        return {[this.allItemsStateName]: stored ? JSON.parse(stored) : {}};
    }

    /** create default getters for the store */
    createDefaultGetters() {
        return {
            [this.readAllGetter]: state => {
                const data = state[this.allItemsStateName];
                // if not all keys are a number, then return as is
                if (Object.keys(data).some(key => isNaN(key))) return data;
                return Object.values(data);
            },
            [this.readByIdGetter]: state => id => state[this.allItemsStateName][id],
        };
    }

    /** create default mutations for the store */
    createDefaultMutations(moduleName) {
        return {
            [this.setAllMutation]: (state, allData) => {
                if (!allData.length) {
                    state[this.allItemsStateName] = allData;
                    this._storageService.setItem(moduleName + this.allItemsStateName, state[this.allItemsStateName]);
                    return;
                }

                for (const data of allData) {
                    const idData = state[this.allItemsStateName][data.id];

                    // if the data for this id already exists and is larger then the current entry, do nothing
                    if (idData && Object.values(idData).length > Object.values(data).length) continue;

                    Vue.set(state[this.allItemsStateName], data.id, data);
                }
                this._storageService.setItem(moduleName + this.allItemsStateName, state[this.allItemsStateName]);
            },
            [this.deleteMutation]: (state, id) => Vue.delete(state[this.allItemsStateName], id),
        };
    }

    /**
     * create default actions for the store
     * if the endpoint is given it also generates actions for the endpoint
     *
     * @param {String} [endpoint] optional endpoint for the API
     * */
    createDefaultActions(endpoint) {
        const actions = {
            [this.setAllAction]: ({commit}, allData) => commit(this.setAllMutation, allData),
        };

        if (!endpoint) return actions;

        actions[this.readAction] = (_, id) => this._httpService.get(endpoint + (id ? `/${id}` : ''));
        // TODO :: create and update could become one
        actions[this.createAction] = (_, item) => this._httpService.post(endpoint, item);
        actions[this.updateAction] = (_, item) => this._httpService.post(`${endpoint}/${item.id}`, item);
        actions[this.deleteAction] = (_, id) => this._httpService.delete(`${endpoint}/${id}`);

        return actions;
    }

    /**
     * create a new action to add to the store which sends a post request
     *
     * @param {String} endpoint api endpoint
     * @param {String} actionName the last part of the url
     */
    createExtraPostAction(endpoint, actionName) {
        return (_, payload) => this._httpService.post(`${endpoint}/${payload.id}/${actionName}`, payload);
    }

    /**
     * create a new action to add to the store which sends a get request
     *
     * @param {String} endpoint api endpoint
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    createExtraGetAction(endpoint, options) {
        return (_, payload) => this._httpService.get(endpoint + (payload ? `/${payload}` : ''), options);
    }

    // prettier-ignore
    get readAllGetter() { return this._readAllGetter; }

    // prettier-ignore
    set readAllGetter(value) { this._readAllGetter = value; }

    // prettier-ignore
    get readByIdGetter() { return this._readByIdGetter; }

    // prettier-ignore
    set readByIdGetter(value) { this._readByIdGetter = value; }

    // prettier-ignore
    get allItemsStateName() { return this._allItemsStateName; }

    // prettier-ignore
    set allItemsStateName(value) { this._allItemsStateName = value; }

    // prettier-ignore
    get setAllMutation() { return this._setAllMutation; }

    // prettier-ignore
    set setAllMutation(value) { this._setAllMutation = value; }

    // prettier-ignore
    get deleteMutation() { return this._deleteMutation; }

    // prettier-ignore
    set deleteMutation(value) { this._deleteMutation = value; }

    // prettier-ignore
    get readAction() { return this._readAction; }

    // prettier-ignore
    set readAction(value) { this._readAction = value; }

    // prettier-ignore
    get updateAction() { return this._updateAction; }

    // prettier-ignore
    set updateAction(value) { this._updateAction = value; }

    // prettier-ignore
    get createAction() { return this._createAction; }

    // prettier-ignore
    set createAction(value) { this._createAction = value; }

    // prettier-ignore
    get deleteAction() { return this._deleteAction; }

    // prettier-ignore
    set deleteAction(value) { this._deleteAction = value; }

    // prettier-ignore
    get setAllAction() { return this._setAllAction; }

    // prettier-ignore
    set setAllAction(value) { this._setAllAction = value; }
}

/**
 * @typedef {import('./factory').StoreModuleFactory} StoreModuleFactory
 * @typedef {import('../http').HTTPService} HTTPService
 * @typedef {import('vuex').Store} Store
 * @typedef {import('vuex').Module} Module
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

class StoreService {
    /**
     * @param {Store} store the store being used
     * @param {StoreModuleFactory} factory the factory being used to create store modules
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(store, factory, httpService) {
        this._store = store;
        this._factory = factory;
        this._httpService = httpService;

        this._moduleNames = [];

        this.setFactorySettings();

        this._httpService.registerResponseMiddleware(this.responseMiddleware);
    }

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
        return this._store.getters[moduleName + this.storeSeperator + getter];
    }

    /**
     * dispatch an action to the store
     *
     * @param {String} moduleName the name of the module to dispatch the action to
     * @param {String} action the name of the action
     * @param {*} payload the payload to sent to the action
     */
    dispatch(moduleName, action, payload) {
        return this._store.dispatch(moduleName + this.storeSeperator + action, payload);
    }

    /**
     * Get all from data from the given store module
     *
     * @param {String} storeModule the module from which to get all
     */
    getAllFromStore(storeModule) {
        return this._store.getters[storeModule + this.getReadAllGetter()];
    }

    /**
     * Get all data from the given store module by id
     *
     * @param {String} storeModule the module from which to get all
     * @param {String} id the id of the data object to get
     */
    getByIdFromStore(storeModule, id) {
        return this._store.getters[storeModule + this.getReadByIdGetter()](id);
    }

    /**
     * dispatch an action to the store, which deletes an item on the server
     *
     * @param {String} storeModule the store module for which an item must be deleted
     * @param {String} id the id of the item to be deleted
     */
    destroy(storeModule, id) {
        return this._store.dispatch(storeModule + this.getDeleteAction(), id).then(response => {
            this._store.commit(storeModule + this.getDeleteMutation(), id);
            return response;
        });
    }

    /**
     * dispatch an action to the store, which updates an item on the server
     *
     * @param {String} storeModule the store module for which an item must be updated
     * @param {Object} item the item to be updated
     */
    update(storeModule, item) {
        return this._store.dispatch(storeModule + this.getUpdateAction(), item);
    }

    /**
     * dispatch an action to the store, which creates an item on the server
     *
     * @param {String} storeModule the store module for which an item must be created
     * @param {Object} item the item to be created
     */
    create(storeModule, item) {
        return this._store.dispatch(storeModule + this.getCreateAction(), item);
    }

    /**
     * dispatch an action to the store, which reads all items on the server
     *
     * @param {String} storeModule the store module for which all items must be read
     */
    read(storeModule) {
        return this._store.dispatch(storeModule + this.getReadAction());
    }

    /**
     * dispatch an action to the store, which reads an item on the server
     *
     * @param {String} storeModule the store module for which the item must be read
     * @param {Number} id the id to be read
     */
    show(storeModule, id) {
        return this._store.dispatch(storeModule + this.getReadAction(), id);
    }

    /**
     * Set all the data in the store module
     *
     * @param {String} storeModule the module to fill the data with
     * @param {*} data data to fill the store with
     */
    setAllInStore(storeModule, data) {
        return this._store.dispatch(storeModule + this.getSetAllInStoreAction(), data);
    }

    /**
     *  get the read all from store getter with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getReadAllGetter(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'all';
    }

    /**
     *  get the read by id from store getter with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getReadByIdGetter(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'byId';
    }

    /**
     *  get the read store action with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getReadAction(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'read';
    }

    /**
     *  get the delete store action with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getDeleteAction(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'destroy';
    }

    /**
     *  get the update store action with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getUpdateAction(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'update';
    }

    /**
     *  get the update store action with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getCreateAction(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'create';
    }

    /**
     *  get the set all in store action with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getSetAllInStoreAction(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'setAll';
    }

    /**
     *  get the all data in store state name with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getAllItemsStateName(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'data';
    }

    /**
     *  get the set all mutation name with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getSetAllMutation(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'SET_ALL';
    }

    /**
     *  get the delete mutation name with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getDeleteMutation(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'DELETE';
    }

    /** get the store seperator */
    get storeSeperator() {
        return '/';
    }

    /** Set the factory name */
    setFactorySettings() {
        // set the factory action names
        this._factory.readAction = this.getReadAction(false);
        this._factory.createAction = this.getCreateAction(false);
        this._factory.updateAction = this.getUpdateAction(false);
        this._factory.deleteAction = this.getDeleteAction(false);
        this._factory.setAllAction = this.getSetAllInStoreAction(false);

        // set the factory getter names
        this._factory.readAllGetter = this.getReadAllGetter(false);
        this._factory.readByIdGetter = this.getReadByIdGetter(false);

        // set the factory state names
        this._factory.allItemsStateName = this.getAllItemsStateName(false);

        // set the factory mutation names
        this._factory.setAllMutation = this.getSetAllMutation(false);
        this._factory.deleteMutation = this.getDeleteMutation(false);
    }

    /**
     * generate and set the default store module in the store
     *
     * @param {String} moduleName the name of the module
     * @param {String} [endpoint] the endpoint for the API
     * @param {Module} [extraFunctionality] extra functionality added to the store
     */
    generateAndSetDefaultStoreModule(moduleName, endpoint, extraFunctionality) {
        const storeModule = this._factory.createDefaultStore(moduleName, endpoint);

        if (extraFunctionality) {
            for (const key in extraFunctionality) {
                for (const name in extraFunctionality[key]) {
                    storeModule[key][name] = extraFunctionality[key][name];
                }
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
        this._store.registerModule(moduleName, storeModule);
    }

    /**
     * create a new action to add to the store which sends a post request
     *
     * @param {String} endpoint api endpoint
     * @param {String} actionName the last part of the url
     */
    createExtraPostAction(endpoint, actionName) {
        return this._factory.createExtraPostAction(endpoint, actionName);
    }

    /**
     * create a new action to add to the store which sends a get request
     *
     * @param {String} endpoint api endpoint
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    createExtraGetAction(endpoint, options) {
        return this._factory.createExtraGetAction(endpoint, options);
    }
}

var NotFoundPage = {
  render(h) {
    return h("div", ["ERROR 404"]);
  },
};

/**
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../router').RouterService} RouterService
 * @typedef {import('../http').HTTPService} HTTPService
 */

class ErrorService {
    /**
     *
     * @param {StoreService} storeService
     * @param {RouterService} routerService
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(storeService, routerService, httpService) {
        this._storeModuleName = 'errors';
        this._storeService = storeService;

        this._storeService.generateAndSetDefaultStoreModule(this._storeModuleName, '', {
            getters: {[this._storeModuleName]: state => state[this._storeService.getAllItemsStateName(false)]},
        });

        this._routerService = routerService;
        this._routerService.addRoutes([
            {
                path: '*',
                component: NotFoundPage,
                meta: {
                    title: 'Pagina niet gevonden',
                    auth: true,
                },
            },
        ]);

        this._routerService.registerAfterMiddleware(this.routeMiddleware);

        this._httpService = httpService;
        this._httpService.registerResponseErrorMiddleware(this.responseErrorMiddleware);
    }

    getErrors() {
        return this._storeService.get(this._storeModuleName, this._storeModuleName);
    }

    setErrors(errors) {
        this._storeService.setAllInStore(this._storeModuleName, errors);
    }

    destroyErrors() {
        this.setErrors({});
    }

    get responseErrorMiddleware() {
        return ({response}) => {
            if (response && response.data.errors) this.setErrors(response.data.errors);
        };
    }

    get routeMiddleware() {
        return (to, from) => this.setErrors({});
    }
}

/**
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../http').HTTPService} HTTPService
 */

class LoadingService {
    /**
     *
     * @param {StoreService} storeService
     * @param {HTTPService} httpService
     */
    constructor(storeService, httpService) {
        // TODO :: do i even need a store? yes i do! cause of computed, can change with vue3
        this._storeModuleName = 'loading';
        this._storeService = storeService;

        this._storeService.generateAndSetDefaultStoreModule(this._storeModuleName);
        this.loading = false;

        // time after which the spinner should show
        this.spinnerTimeout = 500;
        // time the spinner is minimal active
        this.minTimeSpinner = 1000;

        this.loadingTimeoutId;
        this.loadingTimeStart;

        httpService.registerRequestMiddleware(this.requestMiddleware);
        httpService.registerResponseMiddleware(this.responseMiddleware);
        httpService.registerResponseErrorMiddleware(this.responseMiddleware);
    }

    /**
     * get the loading state
     *
     * @returns {Boolean}
     */
    get loading() {
        // TODO :: loading somehow still an array at start, first this fix
        return !!this._storeService.getAllFromStore(this._storeModuleName);
    }

    /**
     * Set the loading state
     *
     * @param {Boolean} loading the loading state
     */
    set loading(loading) {
        if (this.loadingTimeoutId) clearTimeout(this.loadingTimeoutId);

        let timeout = this.spinnerTimeout;

        if (loading) {
            // set the time the loading started
            this.loadingTimeStart = Date.now();
        } else if (this.loadingTimeStart) {
            // get the response time from the request
            const responseTime = Date.now() - this.loadingTimeStart;
            // check the time the spinner is already active and how many ms it should stay active to get to the min time of the spinner
            timeout = this.minTimeSpinner - responseTime + this.spinnerTimeout;
            if (timeout < 0) timeout = 0;
        }

        this.loadingTimeoutId = setTimeout(
            () => this._storeService.setAllInStore(this._storeModuleName, loading),
            timeout
        );
    }

    get requestMiddleware() {
        return () => (this.loading = true);
    }

    get responseMiddleware() {
        return () => (this.loading = false);
    }
}

const IS_LOGGED_IN = 'harry';

var storeModule = (storageService, httpService, authService) => ({
    namespaced: true,
    state: {
        isLoggedIn: !!storageService.getItem(IS_LOGGED_IN),
        // isAdmin: !!storageService.getItem(IS_ADMIN),
        pending: false,
        // userToRegister: {}, // move to register service
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn,
        // isAdmin: state => state.isAdmin,
        // getUserToRegister: state => state.userToRegister,// move to register service
    },
    mutations: {
        LOGIN: state => (state.pending = true),
        LOGIN_SUCCES: (state, isAdmin) => {
            state.pending = false;
            state.isLoggedIn = true;
            storageService.setItem(IS_LOGGED_IN, state.isLoggedIn);
            // if (isAdmin) {
            //     state.isAdmin = isAdmin;
            //     storageService.setItem(IS_ADMIN, isAdmin);
            // } else {
            //     state.isAdmin = false;
            // }
        },
        LOGOUT: _ => {
            storageService.clear();
            // TODO :: or reload state? transition from this is not rly smooth
            window.location.reload(false);
        },
        // SET_USER_TO_REGISTER: (state, payload) => (state.userToRegister = payload),// move to register service
    },
    actions: {
        login: ({commit}, payload) => {
            storageService.keepALive = payload.rememberMe;
            commit('LOGIN');
            return httpService.post('/login', payload).then(response => {
                const isAdmin = response.data.isAdmin;
                commit('LOGIN_SUCCES', isAdmin);
                return response;
            });
        },
        logout: ({commit}) => {
            return httpService.post('logout').then(response => {
                commit('LOGOUT');
                return response;
            });
        },

        sendEmailResetPassword: (_, email) => {
            return httpService.post('/sendEmailResetPassword', email).then(response => {
                if (response.status == 200) authService.goToLoginPage();
            });
        },
        resetPassword: (_, data) => {
            return httpService.post('/resetpassword', data).then(authService.goToLoginPage());
        },
    },
});

var LoginPage = {
  render(h) {
    h("div", ["Implement your own login page!"]);
  },
};

var ForgotPasswordPage = {
    render(h) {
      h("div", ["Implement your own forgot password page!"]);
    },
  };

var ResetPasswordPage = {
    render(h) {
      h("div", ["Implement your own reset password page!"]);
    },
  };

class MissingDefaultLoggedinPageError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingDefaultLoggedinPageError);
        }

        this.name = 'MissingDefaultLoggedinPageError';
    }
}

/**
 * @typedef {import('../router').RouterService} RouterService
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../storage').StorageService} StorageService
 * @typedef {import('../http').HTTPService} HTTPService
 * @typedef {import('vue').Component} Component
 * @typedef {import('vue-router').NavigationGuard} NavigationGuard
 */

const LOGIN_ACTION = 'login';
const LOGOUT_ACTION = 'logout';
const LOGIN_ROUTE_NAME = 'Login';

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

        this._storeService.registerModule(this.storeModuleName, storeModule(storageService, httpService, this));

        this._defaultLoggedInPage;
        this._loginPage = LoginPage;

        this._httpService.registerResponseErrorMiddleware(this.responseErrorMiddleware);
        this._routerService.registerBeforeMiddleware(this.routeMiddleware);
    }

    // prettier-ignore
    get storeModuleName() {return 'auth'}

    get isLoggedin() {
        // TODO :: where to set isLoggedIn?
        return this._storeService.get(this.storeModuleName, 'isLoggedIn');
    }

    // TODO :: this is not basic usage, how to implement this?
    get isAdmin() {
        // TODO :: where to set isAdmin?
        return this._storeService.get(this.storeModuleName, 'isAdmin');
    }

    get defaultLoggedInPage() {
        if (!this._defaultLoggedInPage)
            throw new MissingDefaultLoggedinPageError(
                'Please set the default logged in page with authService.defaultLoggedInPage = "page"'
            );
        return this._defaultLoggedInPage;
    }

    // prettier-ignore
    /** @param {string} page */
    set defaultLoggedInPage(page){this._defaultLoggedInPage = page;}

    // prettier-ignore
    get loginPage() {return this._loginPage}

    // prettier-ignore
    /** @param {Component} page*/
    set loginPage(page) {this._loginPage = page;}

    /**
     * Login to the app
     * @param {Object} credentials the credentials to login with
     * @param {String} credentials.email the email to login with
     * @param {String} credentials.password the password to login with
     * @param {Boolean} credentials.rememberMe if you want a consistent login
     */
    login(credentials) {
        // TODO :: isAdmin should be something like role
        return this._storeService.dispatch(this.storeModuleName, LOGIN_ACTION, credentials).then(response => {
            // TODO :: check roles here somehow?
            // if (isAdmin) return this._routerService.goToRoute('courses.edit');
            this.goToStandardLoggedInPage();
            return response;
        });
    }

    logout() {
        return this._storeService.dispatch(this.storeModuleName, LOGOUT_ACTION);
    }

    sendEmailResetPassword(email) {
        return this._storeService.dispatch(this.storeModuleName, 'sendEmailResetPassword', email);
    }

    resetPassword(data) {
        return this._storeService.dispatch(this.storeModuleName, 'resetPassword', data);
    }

    goToStandardLoggedInPage() {
        this._routerService.goToRoute(this.defaultLoggedInPage);
    }

    goToLoginPage() {
        this._routerService.goToRoute(LOGIN_ROUTE_NAME);
    }

    get responseErrorMiddleware() {
        return ({response}) => {
            if (!response) return;
            const {status} = response;
            if (status == 403) {
                this.goToStandardLoggedInPage();
            } else if (status == 401) {
                this.logout();
            }
        };
    }

    /** @returns {NavigationGuard} */
    get routeMiddleware() {
        return (to, from, next) => {
            const isLoggedIn = this.isLoggedin;
            // const isAdmin = this.isAdmin;

            if (isLoggedIn && !to.meta.auth) {
                this.goToStandardLoggedInPage();
                return true;
            }

            // if (!isAdmin && to.meta.admin) {
            //     this.goToStandardLoggedInPage();
            //     return true;
            // }

            if (!isLoggedIn && to.meta.auth) {
                this.goToLoginPage();
                return true;
            }

            return false;
        };
    }

    setRoutes() {
        const loginRoute = this._routerService._factory.createConfig(
            '/inloggen',
            LOGIN_ROUTE_NAME,
            this.loginPage,
            false,
            false,
            'Login'
        );

        const forgotPasswordRoute = this._routerService._factory.createConfig(
            '/wachtwoord-vergeten',
            'ForgotPassword',
            ForgotPasswordPage,
            false,
            false,
            'Wachtwoord vergeten'
        );

        const resetPasswordRoute = this._routerService._factory.createConfig(
            '/wachtwoord-resetten',
            'ResetPassword',
            ResetPasswordPage,
            false,
            false,
            'Wachtwoord resetten'
        );

        this._routerService.addRoutes([loginRoute, forgotPasswordRoute, resetPasswordRoute]);
    }
}

const storageService = new StorageService();
// Bind the store to Vue and generate empty store
Vue.use(Vuex);
const store = new Vuex.Store();
const httpService = new HTTPService(storageService);
const eventService = new EventService(httpService);
const translatorService = new TranslatorService();

const routeFactory = new RouteFactory();
const routeSettings = new RouteSettings(translatorService);
const routerService = new RouterService(routeFactory, routeSettings);

const storeFactory = new StoreModuleFactory(httpService, storageService);
const storeService = new StoreService(store, storeFactory, httpService);
const errorService = new ErrorService(storeService, routerService, httpService);
const loadingService = new LoadingService(storeService, httpService);

const authService = new AuthService(routerService, storeService, storageService, httpService);

/**
 * @typedef {import('../services/error').ErrorService} ErrorService
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 * @typedef {import('../services/event').EventService} EventService
 * @typedef {import('../services/router').RouterService} RouterService
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('vue').Component} Component
 */

class PageCreator {
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

    /**
     * @param {CreateElement} h
     */
    init(h) {
        // TODO :: also attach h to other creators here
        this._h = h;
    }

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
     */
    editPage(form, getter, subject, updateAction, destroyAction, showAction) {
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
            render() {
                if (!this.item) return;

                const containerChildren = [
                    pageCreator.createEditPageTitle(this.item),
                    pageCreator.createForm(form, this.editable, updateAction),
                ];

                if (destroyAction) {
                    // TODO :: move to method, when there are more b-links
                    // TODO :: uses Bootstrap-Vue element
                    containerChildren.push(
                        pageCreator._h(
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

    /** @param {VNode[]} children */
    createContainer(children) {
        return this._h('div', {class: 'ml-0 container'}, children);
    }
    /** @param {VNode[]} children */
    createRow(children) {
        return this._h('div', {class: 'row'}, children);
    }
    /** @param {VNode[]} children */
    createCol(children) {
        return this._h('div', {class: 'col'}, children);
    }

    /** @param {String} title */
    createTitle(title) {
        return this.createRow([this.createCol([this._h('h1', [title])])]);
    }

    /** @param {String} subject */
    createCreatePageTitle(subject) {
        return this.createTitle(this._translatorService.getCapitalizedSingular(subject) + ` toevoegen`);
    }

    /** @param {Object<string,any>} item */
    createEditPageTitle(item) {
        // TODO :: it's not always name!
        let name = item.name || item.title;
        if (item.firstname) {
            name = `${item.firstname} ${item.lastname}`;
        }
        return this.createTitle(name + ' aanpassen');
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

/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

class ButtonCreator {
    constructor() {
        /** @type {CreateElement} */
        this._h;
        this._buttonContainerHTMLElement = 'b-form-group';
        this._buttonContainerClass = 'mb-3';
        this._buttonHTMLElement = 'b-button';
    }

    init(h) {
        this._h = h;
    }

    /**
     *
     * @param {CreateElement} h
     * @param {String} type
     * @param {String} innerHTML
     * @param {String} variant
     */
    button(h, type, innerHTML, variant) {
        return h(
            this._buttonContainerHTMLElement,
            {
                class: this._buttonContainerClass,
            },
            [
                h(this._buttonHTMLElement, {
                    props: {variant, type},
                    domProps: {innerHTML},
                }),
            ]
        );
    }

    submitButton(h) {
        return this.button(h, 'submit', 'Opslaan', 'secondary');
    }
}

/**
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('./buttons').ButtonCreator} ButtonCreator
 */
class FormCreator {
    /**
     * @param {ButtonCreator} buttonCreator
     */
    constructor(buttonCreator) {
        /** @type {CreateElement} */
        this._h;
        this._buttonCreator = buttonCreator;

        this._formHTMLElement = 'b-form';
        this._formClass = 'edit-form';
    }

    init(h) {
        this._h = h;
    }

    /**
     * @param {CreateElement} h
     * @param {VNode[]} children
     * @param {Function} submit
     */
    form(h, children, submit) {
        return h(
            this._formHTMLElement,
            {
                class: this._formClass,
                novalidate: true,
                on: {
                    submit: e => {
                        e.preventDefault();
                        submit();
                    },
                },
            },
            [...children, this._buttonCreator.submitButton(h)]
        );
    }
}

/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

const buttonCreator = new ButtonCreator();
const formCreator = new FormCreator(buttonCreator);

const pageCreator = new PageCreator(errorService, translatorService, eventService, routerService);

/**
 * @typedef {import('../services/router').RouterService} RouterService
 * @typedef {import('../services/event').EventService} EventService
 * @typedef {import('../services/auth').AuthService} AuthService
 * @typedef {import('../creators/pages').PageCreator} PageCreator
 * @typedef {import('vue').Component} Component
 */

class AppStarter {
    /**
     * @param {RouterService} routerService
     * @param {EventService} eventService
     * @param {AuthService} authService
     * @param {PageCreator} pageCreator
     */
    constructor(routerService, eventService, authService, pageCreator) {
        this._routerService = routerService;
        this._eventService = eventService;
        this._authService = authService;
        this._pageCreator = pageCreator;
    }

    /**
     * Start the app and set required settings
     *
     * @param {Component} mainComponent the main app component
     * @param {String} defaultLoggedInPage the page to go to when logged in
     * @param {Component} loginPage the login page
     */
    start(mainComponent, defaultLoggedInPage, loginPage) {
        this._authService.defaultLoggedInPage = defaultLoggedInPage;
        this._authService.loginPage = loginPage;
        this._authService.setRoutes();

        this._eventService.app = new Vue({
            el: '#app',
            router: this._routerService.router,
            render: h => {
                this._pageCreator.init(h);
                return h(mainComponent);
            },
        });
    }
}

const name = 'default';

var MinimalRouterView = {
    name: 'MinimalRouterView',
    functional: true,
    props: {
        depth: {
            type: Number,
            default: 0,
        },
    },
    render(h, {
        props,
        children,
        parent,
        data
    }) {
        const route = parent.$route;
        const matched = route.matched[props.depth];
        const component = matched && matched.components[name];

        // render empty node if no matched route or no config component
        if (!matched || !component) {
            return h();
        }
        return h(component, data, children);
    },
};

/**
 * @typedef {import('../services/translator').Translation} Translation
 * @typedef {import('vuex').Module} Module
 * @typedef {import('vuex').ActionMethod} ActionMethod
 * @typedef {import('vuex').Mutation} MutationMethod
 *
 * @typedef {(State) => any} GetterMethod
 */

class BaseController {
    /**
     * @param {String} APIEndpoint
     * @param {Translation} [translation]
     */
    constructor(APIEndpoint, translation) {
        this._storeService = storeService;
        this._routerService = routerService;
        this._pageCreatorService = pageCreator;
        this._eventService = eventService;
        this._translatorService = translatorService;

        if (!translation) {
            translation = {singular: APIEndpoint, plural: APIEndpoint};
        }

        this._translatorService.setTranslation(APIEndpoint, translation);

        this._APIEndpoint = APIEndpoint;

        /**
         * Set the routes to go to after a certain action has been done by the store
         * Can be edited/overwritten in controller
         */
        this._goToPageAfterEditAction = this.goToShowPage;
        this._goToPageAfterCreateAction = this.goToOverviewPage;
        this._goToPageAfterDeleteAction = this.goToOverviewPage;

        /**
         * @type {Module}
         * Extra store functionality can added through the store service
         */
        this._extraStoreFunctionality = {};

        /**
         * Initiate basic route settings
         * Settings can be changed in controller
         */
        this._routeSettings = this._routerService.newSettings(APIEndpoint);

        /**
         * Set basic pages, so there will be custom errors in the console when something is not implemented
         * Can be edited/overwritten in controller
         */
        this.routeSettings.baseComponent = this.basePage;
        this.routeSettings.editComponent = this.editPage;
        this.routeSettings.showComponent = this.showPage;
        this.routeSettings.overviewComponent = this.overviewPage;
        this.routeSettings.createComponent = this.createPage;
    }

    // prettier-ignore
    get APIEndpoint() {return this._APIEndpoint}

    /** go to pages functions */
    goToOverviewPage() {
        this._routerService.goToRoute(this.routeSettings.overviewName);
    }

    goToShowPage(id) {
        this._routerService.goToRoute(this.routeSettings.showName, id);
    }

    /**
     * Go to the edit page for this controller
     * @param {String} id
     * @param {Object.<string, string>} [query] the optional query for the new route
     */
    goToEditPage(id, query) {
        this._routerService.goToRoute(this.routeSettings.editName, id, query);
    }

    /**
     * Go to the create page for this controller
     *
     * @param {Object.<string, string>} [query] the optional query for the new route
     */
    goToCreatePage(query) {
        this._routerService.goToRoute(this.routeSettings.createName, undefined, query);
    }

    /** store service getter functions */
    getAll() {
        return this._storeService.getAllFromStore(this._APIEndpoint);
    }

    getById(id) {
        return this._storeService.getByIdFromStore(this._APIEndpoint, id);
    }

    get getByCurrentRouteId() {
        return () => this.getById(this._routerService.id);
    }

    /** store service action functions */
    get update() {
        return (item, goToRouteName) =>
            this._storeService.update(this._APIEndpoint, item).then(() => {
                if (!goToRouteName) return this._goToPageAfterEditAction(item.id);
                this._routerService.goToRoute(goToRouteName);
            });
    }

    get create() {
        return (item, goToRouteName) =>
            this._storeService.create(this._APIEndpoint, item).then(() => {
                if (!goToRouteName) return this._goToPageAfterCreateAction(item.id);
                this._routerService.goToRoute(goToRouteName);
            });
    }

    get destroy() {
        return (id, goToRouteName) =>
            this._storeService.destroy(this._APIEndpoint, id).then(() => {
                if (!goToRouteName) return this._goToPageAfterDeleteAction(id);
                this._routerService.goToRoute(goToRouteName);
            });
    }

    get destroyByIdWithoutRouteChange() {
        return id => this._storeService.destroy(this._APIEndpoint, id);
    }

    get destroyByCurrentRouteId() {
        return () => this.destroy(this._routerService.id);
    }

    get read() {
        return () => this._storeService.read(this._APIEndpoint);
    }

    get showByCurrentRouteId() {
        return () => this._storeService.show(this._APIEndpoint, this._routerService.id);
    }

    get show() {
        return id => this._storeService.show(this._APIEndpoint, id);
    }

    /** base pages */
    get basePage() {
        return {
            render: h => h(MinimalRouterView, {props: {depth: 1}}),
            // TODO #9 @Goosterhof
            mounted: () => this.read(),
        };
    }

    get overviewPage() {
        console.warn('overview page not implemented for', this._APIEndpoint);
    }

    get createPage() {
        console.warn('create page not implemented for', this._APIEndpoint);
    }

    get showPage() {
        console.warn('show page not implemented for', this._APIEndpoint);
    }

    get editPage() {
        console.warn('edit page not implemented for', this._APIEndpoint);
    }

    /**
     * init the controller
     * this will add a module to the store and register routes
     */
    init() {
        this._storeService.generateAndSetDefaultStoreModule(
            this.APIEndpoint,
            this.APIEndpoint,
            this._extraStoreFunctionality
        );

        /**
         * Create basic routes and add them to the global routes
         * Routes can only be: show, overview, edit and create
         */
        const routes = this._routerService.createRoutes(this.routeSettings);
        this._routerService.addRoutes(routes);
    }

    // prettier-ignore
    get routeSettings() { return this._routeSettings; }

    get destroyModalMessage() {
        return `Weet je zeker dat je deze ${this._translatorService.getSingular(this.APIEndpoint)} wil verwijderen?`;
    }

    get destroyByCurrentRouteIdModal() {
        return () => this._eventService.modal(this.destroyModalMessage, this.destroyByCurrentRouteId);
    }

    get destroyByIdModal() {
        return id => this._eventService.modal(this.destroyModalMessage, () => this.destroyByIdWithoutRouteChange(id));
    }

    /**
     * Add an extra action to this store module
     *
     * @param {String} name name of the new action
     * @param {ActionMethod} action
     */
    setExtraStoreAction(name, action) {
        if (!this._extraStoreFunctionality.actions) {
            this._extraStoreFunctionality.actions = {};
        }
        this._extraStoreFunctionality.actions[name] = action;
    }

    /**
     * Add an extra mutation to this store module
     *
     * @param {String} name name of the new action
     * @param {MutationMethod} mutation
     */
    setExtraStoreMutation(name, mutation) {
        if (!this._extraStoreFunctionality.mutations) {
            this._extraStoreFunctionality.mutations = {};
        }
        this._extraStoreFunctionality.mutations[name] = mutation;
    }

    /**
     * Add an extra getter to this store module
     *
     * @param {String} name name of the new getter
     * @param {GetterMethod} getter
     */
    setExtraStoreGetter(name, getter) {
        if (!this._extraStoreFunctionality.getters) {
            this._extraStoreFunctionality.getters = {};
        }
        this._extraStoreFunctionality.getters[name] = getter;
    }

    /**
     * create a new action to add to the store which sends a get request
     * url for the new request will be: this.APIEndpoint + payload ? `/${payload}` : ''
     *
     * @param {String} name name of the new action
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    createAndSetExtraGetAction(name, options) {
        this.setExtraStoreAction(name, this._storeService.createExtraGetAction(this.APIEndpoint, options));
    }

    /**
     * create a new action to add to the store which sends a post request
     * url for the post request will be: `${this.APIEndpoint}/${payload.id}/${name}
     *
     * @param {String} name name of the new action and the last part of the url
     */
    createAndSetExtraPostAction(name) {
        this.setExtraStoreAction(name, this._storeService.createExtraPostAction(this.APIEndpoint, name));
    }

    /**
     * dispatch an action to the store
     * @param {String} action the name of the action being dispatched
     * @param {*} payload the payload being used by the action
     */
    dispatchToStore(action, payload) {
        this._storeService.dispatch(this.APIEndpoint, action, payload);
    }

    /**
     * pops up a modal with the given message
     * @param {String} message the message being shown by the modal
     * @param {Function} okAction the function being used when click on ok
     * @param {Function} [cancelAction] the being used when click on cancel
     */
    popModal(message, okAction, cancelAction) {
        this._eventService.modal(message, okAction, cancelAction);
    }
}

const appStarter = new AppStarter(routerService, eventService, authService, pageCreator);

export { BaseController, appStarter, authService, buttonCreator, errorService, eventService, formCreator, httpService, loadingService, pageCreator, routerService, storeService, translatorService };

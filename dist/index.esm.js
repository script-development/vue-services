import { createApp, defineComponent, h, ref, computed } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';

class MissingTranslationError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        this.name = 'MissingTranslationError';
    }
}

/**
 * @todo move to types.d.ts
 * @typedef {import('../../../types/types').Translation} Translation
 * @typedef {import('../../../types/types').Translations} Translations
 */

const PLURAL = 'plural';
const SINGULAR = 'singular';

/** @type {Translations} */
const TRANSLATIONS = {};

/**
 * Get plural or singular translation for given moduleName
 *
 * @param {String} moduleName
 * @param {PLURAL | SINGULAR} pluralOrSingular
 *
 * @throws {MissingTranslationError}
 */
const getTranslation = (moduleName, pluralOrSingular) => {
    const translation = TRANSLATIONS[moduleName];

    if (!translation) throw new MissingTranslationError(`Missing translation for ${moduleName}`);
    if (!translation[pluralOrSingular]) {
        throw new MissingTranslationError(`Missing ${pluralOrSingular} translation for ${moduleName}`);
    }

    return translation[pluralOrSingular];
};

/**
 * Capitalize the give value
 * @param {String} value
 */
const capitalize = value => `${value[0].toUpperCase()}${value.substr(1)}`;

/**
 * Get the plural translation for the given moduleName
 *
 * @param {String} moduleName
 *
 * @throws {MissingTranslationError}
 */
const getPluralTranslation = moduleName => getTranslation(moduleName, PLURAL);

/**
 * Get the plural translation for the given moduleName and capitalize it
 *
 * @param {String} moduleName
 *
 * @throws {MissingTranslationError}
 */
const getCapitalizedPluralTranslation = moduleName => capitalize(getPluralTranslation(moduleName));

/**
 * Get the singular translation for the given moduleName
 *
 * @param {String} moduleName
 *
 * @throws {MissingTranslationError}
 */
const getSingularTranslation = moduleName => getTranslation(moduleName, SINGULAR);

/**
 * Get the singular translation for the given moduleName and capitalize it
 *
 * @param {String} moduleName
 *
 * @throws {MissingTranslationError}
 */
const getCapitalizedSingularTranslation = moduleName => capitalize(getSingularTranslation(moduleName));

/**
 * @param {string} moduleName
 * @param {Translation} translation
 */
const setTranslation = (moduleName, translation) => (TRANSLATIONS[moduleName] = translation);

/**
 * @typedef {import('vue').Component} Component
 * @typedef {import('vue-router').RouteRecordRaw} RouteRecordRaw
 * @typedef {import('../../../../types/services/router').RouteSettings} RouteSettings
 */

const CREATE_PAGE_NAME = '.create';
const EDIT_PAGE_NAME = '.edit';
const OVERVIEW_PAGE_NAME = '.overview';
const SHOW_PAGE_NAME = '.show';

const CREATE = 'create';
const EDIT = 'edit';
const OVERVIEW = 'overview';
const SHOW = 'show';

const nameConversion = {
    [CREATE]: CREATE_PAGE_NAME,
    [EDIT]: EDIT_PAGE_NAME,
    [OVERVIEW]: OVERVIEW_PAGE_NAME,
    [SHOW]: SHOW_PAGE_NAME,
};

const titleConversion = {
    [CREATE]: ' aanmaken',
    [EDIT]: ' aanpassen',
    [OVERVIEW]: ' overzicht',
    [SHOW]: ' bekijken',
};

const pathConversion = {
    [CREATE]: 'toevoegen',
    [EDIT]: ':id/aanpassen',
    [OVERVIEW]: '',
    [SHOW]: ':id',
};

const translationConversion = {
    [CREATE]: getCapitalizedSingularTranslation,
    [EDIT]: getCapitalizedSingularTranslation,
    [OVERVIEW]: getCapitalizedPluralTranslation,
    [SHOW]: getCapitalizedSingularTranslation,
};

// TODO :: children requires different route?
/**
 * Creates a route record for the route settings.
 * Exported for testing purposes. Is not exported in the final product
 *
 * @param {string} moduleName
 * @param {CREATE | EDIT | OVERVIEW | SHOW} part
 * @param {Component} component
 *
 * @returns {RouteRecordRaw}
 */
const partialFactory = (moduleName, part, component) => {
    return {
        name: moduleName + nameConversion[part],
        path: pathConversion[part],
        component,
        meta: {
            auth: true,
            title: translationConversion[part](moduleName) + titleConversion[part],
        },
        children: undefined,
    };
};

/**
 * Creates standard route settings.
 * Creates settings for the optional routes when the components are given.
 * Does not add the optional routes otherwise
 *
 * @param {string} moduleName
 * @param {Component} baseComponent
 * @param {Component} [overviewComponent]
 * @param {Component} [createComponent]
 * @param {Component} [editComponent]
 * @param {Component} [showComponent]
 *
 * @returns {RouteSettings}
 */
var RouteSettingFactory = (moduleName, baseComponent, overviewComponent, createComponent, editComponent, showComponent) => {
    const routeSettings = {
        base: {
            path: '/' + getPluralTranslation(moduleName),
            component: baseComponent,
        },
    };

    if (createComponent) routeSettings[CREATE] = partialFactory(moduleName, CREATE, createComponent);
    if (overviewComponent) routeSettings[OVERVIEW] = partialFactory(moduleName, OVERVIEW, overviewComponent);
    if (editComponent) routeSettings[EDIT] = partialFactory(moduleName, EDIT, editComponent);
    if (showComponent) routeSettings[SHOW] = partialFactory(moduleName, SHOW, showComponent);

    return routeSettings;
};

/**
 * @typedef {import("vue-router").RouteRecordRaw} RouteRecordRaw
 * @typedef {import("vue-router").NavigationGuard} NavigationGuard
 * @typedef {import("vue-router").NavigationHookAfter} NavigationHookAfter
 * @typedef {import('vue-router').LocationQuery} LocationQuery
 *
 * @typedef {import('../../../types/services/router').RouteSettings} RouteSettings
 */

// exported only to use in the app starter to bind the router
const router = createRouter({
    history: createWebHistory(),
    routes: [],
});

/**
 * Checks if there is a target route name in the route query.
 * If there is, it will redirect to that route.
 * Exported for testing purposes
 *
 * @type {NavigationGuard}
 */
const beforeMiddleware = (to, from) => {
    /** @type {string} */
    // @ts-ignore
    const fromQuery = from.query.from;
    if (!fromQuery) return false;

    if (fromQuery === to.fullPath) return false;

    router.push({name: fromQuery});
    return true;
};

/** @type {NavigationGuard[]} */
const routerBeforeMiddleware = [beforeMiddleware];
router.beforeEach((to, from, next) => {
    for (const middlewareFunc of routerBeforeMiddleware) {
        // MiddlewareFunc will return true if it encountered problems
        if (middlewareFunc(to, from, next)) return next(false);
    }
    return next();
});

/** @type {NavigationHookAfter[]} */
const routerAfterMiddleware = [];
router.afterEach((to, from) => {
    for (const middlewareFunc of routerAfterMiddleware) {
        middlewareFunc(to, from);
    }
});

/** @param {RouteRecordRaw} routes */
const addRoutes = routes => router.addRoute(routes);

/** @param {RouteSettings} settings */
const addRoutesBasedOnRouteSettings = settings => {
    const record = settings.base;
    delete settings.base;
    record.children = Object.values(settings);
    addRoutes(record);
};

/**
 * Go to the give route by name, optional id and query
 * If going to a route you are already on, it catches the given error
 *
 * @param {String} name the name of the new route
 * @param {String} [id] the optional id for the params of the new route
 * @param {LocationQuery} [query] the optional query for the new route
 */
const goToRoute = (name, id, query) => {
    if (onPage(name) && !query && !id) return;

    /** @type {import('vue-router').RouteLocationRaw} */
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
};

/** Get the current route */
const getCurrentRoute = () => router.currentRoute;
/** Get the id from the params from the current route */
const getCurrentRouteId = () => router.currentRoute.value.params.id.toString();
/** Get the name from the current route */
const getCurrentRouteName = () => router.currentRoute.value.name.toString();

/**
 * checks if the given string is in the current routes name
 * @param {string} pageName the name of the page to check
 */
const onPage = pageName => getCurrentRouteName().toString().includes(pageName);

/**
 * @typedef {import('../services/router').RouterService} RouterService
 * @typedef {import('../services/event').EventService} EventService
 * @typedef {import('../services/auth').AuthService} AuthService
 * @typedef {import('../services/staticdata').StaticDataService} StaticDataService
 * @typedef {import('../controllers').BaseController} BaseController
 * @typedef {import('vue').Component} Component
 */

/**
 * Start the app and set required settings
 *
 * @param {Component} mainComponent the main app component
 * @param {String} defaultLoggedInPageName the page to go to when logged in
 * @param {Component} loginPage the login page
 * @param {Object<string,BaseController>} controllers the login page
 * @param {[string,Object<string,string>]} [staticData] the static data
 */
// export const startApp = (mainComponent, defaultLoggedInPageName, loginPage, controllers, staticData) => {
const startApp = (mainComponent, controllers) => {
    // if (staticData) this._staticDataService.createStoreModules(staticData);

    // this._authService.defaultLoggedInPageName = defaultLoggedInPageName;
    // this._authService.loginPage = loginPage;
    // this._authService.setRoutes();

    for (const controller in controllers) controllers[controller].init();

    const app = createApp(mainComponent);
    app.use(router);
    app.mount('#app');

    // this._eventService.app = createApp(mainComponent);
    // this._eventService.app.use(this._routerService.router);
    // this._eventService.app.mount('#app');

    // TODO :: could even do this first and .then(()=>this._authService.getLoggedInUser())
    // or make it a setting
    // if (this._authService.isLoggedin) this._authService.getLoggedInUser();
};

const name = 'default';

var MinimalRouterView = defineComponent({
    name: 'MinimalRouterView',
    functional: true,
    props: {
        depth: {
            type: Number,
            default: 0,
        },
    },
    setup(props) {
        const matched = getCurrentRoute().value.matched[props.depth];
        const component = matched && matched.components[name];

        // render empty node if no matched route or no config component
        if (!matched || !component) {
            return () => h('div', [404]);
        }
        return () => h(component);
    },
});

/**
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 *
 * @typedef {import('../../../types/types').Cache} Cache
 * @typedef {import('../../../types/types').RequestMiddleware} RequestMiddleware
 * @typedef {import('../../../types/types').ResponseMiddleware} ResponseMiddleware
 * @typedef {import('../../../types/types').ResponseErrorMiddleware} ResponseErrorMiddleware
 */
// TODO :: heavilly dependant on webpack and laravel mix
// TODO :: how to test these branches?
const API_URL = process.env.MIX_APP_URL ? `${process.env.MIX_APP_URL}/api` : '/api';

const CACHE_KEY = 'HTTP_CACHE';

/** @type {number} */
let cacheDuration = 10;

// Not using storageService here, cause it always needs to be stored in the localStorage
const preCache = localStorage.getItem(CACHE_KEY);
// TODO :: how to test these branches?
/** @type {Cache} */
const cache = preCache ? JSON.parse(preCache) : {};

const http = axios.create({
    baseURL: API_URL,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

/** @type {RequestMiddleware[]} */
const requestMiddleware = [];
/** @type {ResponseMiddleware[]} */
const responseMiddleware = [];
/** @type {ResponseErrorMiddleware[]} */
const responseErrorMiddleware = [];

http.interceptors.request.use(request => {
    for (const middleware of requestMiddleware) middleware(request);
    return request;
});

http.interceptors.response.use(
    response => {
        for (const middleware of responseMiddleware) middleware(response);
        return response;
    },
    error => {
        if (!error.response) return Promise.reject(error);
        for (const middleware of responseErrorMiddleware) middleware(error);
        return Promise.reject(error);
    }
);

/**
 * send a get request to the given endpoint
 * @param {String} endpoint the endpoint for the get
 * @param {AxiosRequestConfig} [options] the optional request options
 */
const getRequest = async (endpoint, options) => {
    // get currentTimeStamp in seconds
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    if (cache[endpoint] && !options) {
        // if it has been less then the cache duration since last requested this get request, do nothing
        if (currentTimeStamp - cache[endpoint] < cacheDuration) return;
    }

    return http.get(endpoint, options).then(response => {
        cache[endpoint] = currentTimeStamp;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        return response;
    });
};

/**
 * send a post request to the given endpoint with the given data
 * @param {String} endpoint the endpoint for the post
 * @param {any} data the data to be send to the server
 */
const postRequest = async (endpoint, data) => http.post(endpoint, data);

/**
 * send a delete request to the given endpoint
 * @param {String} endpoint the endpoint for the get
 */
const deleteRequest = async endpoint => http.delete(endpoint);

/** @param {ResponseMiddleware} middlewareFunc */
const registerResponseMiddleware = middlewareFunc => responseMiddleware.push(middlewareFunc);

class StoreModuleNotFoundError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        this.name = 'StoreModuleNotFoundError';
    }
}

const KEEP_A_LIVE_KEY = 'keepALive';
/** setting keepALive here so we don't have to Parse it each time we get it */
const storedKeepALive = localStorage.getItem(KEEP_A_LIVE_KEY);
/** @type {Boolean} */
let keepALive = storedKeepALive ? JSON.parse(storedKeepALive) : false;

/**
 * Set the given value in the storage under the given key
 * If the value is not of type String, it will be converted to String
 *
 * @param {String} key
 * @param {String | any} value
 */
const setItemInStorage = (key, value) => {
    // TODO :: Stryker ConditionalExpression survived, when mutated to false
    if (!keepALive) return;
    if (typeof value !== 'string') value = JSON.stringify(value);
    localStorage.setItem(key, value);
};

/**
 * Get the value from the storage under the given key.
 * Returns null if value is not found or if keepALive is false
 *
 * @param {String} key
 * @param {Boolean} [parse] if parse is given, then JSON.parse will be used to return a parsed value
 */
const getItemFromStorage = (key, parse) => {
    // TODO :: Stryker ConditionalExpression survived, when mutated to false
    if (!keepALive) return null;

    const value = localStorage.getItem(key);
    // TODO :: Stryker ConditionalExpression survived, when mutated to false
    if (!value) return null;
    if (!parse) return value;

    try {
        return JSON.parse(value);
    } catch (_) {
        // Can it throw something else then a SyntaxError?
        // if (error instanceof SyntaxError) {
        return value;
        // }
    }
};

/**
 * @typedef {import('../../../../types/types').State} State
 * @typedef {import('../../../../types/types').Item} Item
 * @typedef {import('../../../../types/services/store').StoreModule} StoreModule
 */

// TODO :: it makes it a lot easier if we only handle id based items
// changing it to only id based items, need to check if it can handle it
// TODO :: JSDoc and vsCode can't handle the Item|Item[] parameter

/**
 * Creates a store module for the given module name.
 * When extra store functionality is given, it will extend the base module with the extra functionality.
 *
 * @param {string} moduleName the name of the module, also the endpoint for the module
 *
 * @returns {StoreModule}
 */
var StoreModuleFactory = moduleName => {
    /** @type {State} */
    const state = ref(getItemFromStorage(moduleName, true) ?? {});

    return {
        /** Get all items from the store */
        all: computed(() => Object.values(state.value)),
        // TODO :: byId computed? Will it be reactive this way?
        /**
         * Get an item from the state by id
         *
         * @param {string} id
         * @returns {Item}
         */
        byId: id => state.value[id],
        /**
         * Set data in the state.
         * Data can be of any kind.
         *
         * @param {Item|Item[]} data the data to set
         */
        setAll: data => {
            if (!data.length) {
                // if data is not an array it probably recieves a single item with an id
                // if that's not the case then return
                if (!data.id) return;

                // TODO :: vue-3 :: check if vue-3 is reactive this way
                state.value[data.id] = data;
            } else if (data.length === 1) {
                // if data has an array with 1 entry, put it in the state
                state.value[data[0].id] = data[0];
            } else {
                // if data has more entries, then that's the new baseline
                for (const id in state.value) {
                    // search for new data entry
                    const newDataIndex = data.findIndex(entry => entry.id == id);
                    // if not found, then delete entry
                    if (newDataIndex === -1) {
                        // TODO :: vue-3 :: check if vue-3 is reactive this way
                        delete state.value[id];
                        continue;
                    }
                    // remove new entry from data, so further searches speed up
                    const newData = data.splice(newDataIndex, 1)[0];

                    // if the entry for this id is larger then the current entry, do nothing
                    if (Object.values(state.value[id]).length > Object.values(newData).length) continue;

                    state.value[newData.id] = newData;
                }

                // put all remaining new data in the state
                for (const newData of data) {
                    state.value[newData.id] = newData;
                }
            }

            setItemInStorage(moduleName, state.value);
        },
    };
};

/**
 * @typedef {import('../../../types/types').Item} Item
 * @typedef {import('../../../types/types').ResponseMiddleware} ResponseMiddleware
 * @typedef {import('../../../types/services/store').StoreModule} StoreModule
 * @typedef {import('../../../types/services/store').Store} Store
 */

/** @type {Store} */
const store = {};

/** @type {String[]} */
const moduleNames = [];

/**
 * Checks if requested module exists in the store
 * If not, throws a StoreModuleNotFoundError
 *
 * @param {String} moduleName the name to check if exists
 *
 * @throws {StoreModuleNotFoundError} when the given moduleName does not exist
 */
const checkIfRequestedModuleExists = moduleName => {
    if (moduleNames.indexOf(moduleName) !== -1) return;

    throw new StoreModuleNotFoundError(
        `Could not find ${moduleName}, only these modules exists at the moment: ${moduleNames.toString()}`
    );
};

/**
 * The store service response middleware checks if any of the known modulenames is in the data of the response
 * When there is a modulename in the response it dispatches an action to that module to set the response data in the store
 *
 * it is exported for testing purposes, it's not exported to the users
 *
 * @type {ResponseMiddleware}
 */
const responseMiddleware$1 = ({data}) => {
    if (!data) return;
    for (const storeModuleName of moduleNames) {
        if (!data[storeModuleName]) continue;

        store[storeModuleName].setAll(data[storeModuleName]);
    }
};

registerResponseMiddleware(responseMiddleware$1);

/**
 * Get all from data from the given store module
 *
 * @param {String} moduleName the module from which to get all
 *
 * @returns {import('vue').ComputedRef<Item[]>}
 */
const getAllFromStore = moduleName => {
    // TODO :: check if this is always called when the computed changes
    checkIfRequestedModuleExists(moduleName);
    return store[moduleName].all;
};

/**
 * Get all data from the given store module by id
 *
 * @param {String} moduleName the module from which to get all
 * @param {String} id the id of the data object to get
 *
 * @return {Item}
 */
const getByIdFromStore = (moduleName, id) => {
    // TODO :: check if this is always called when the computed changes
    checkIfRequestedModuleExists(moduleName);
    return store[moduleName].byId(id);
};

/**
 * set the store module in the store
 *
 * @param {String} moduleName the name of the module
 * @param {StoreModule} storeModule the module to add to the store
 */
const registerStoreModule = (moduleName, storeModule) => {
    moduleNames.push(moduleName);
    store[moduleName] = storeModule;
};

/**
 * generate and set the default store module in the store
 *
 * @param {String} moduleName the name of the module
 */
const generateAndRegisterDefaultStoreModule = moduleName =>
    registerStoreModule(moduleName, StoreModuleFactory(moduleName));

/**
 * @typedef {import('vue-router').LocationQuery} LocationQuery
 *
 * @typedef {import('../../types/types').Item} Item
 * @typedef {import('../../types/types').Translation} Translation
 *
 */

/**
 * @param {string} moduleName
 * @param {Object} components
 * @param {Translation} translation
 */
var index = (moduleName, components, translation) => {
    generateAndRegisterDefaultStoreModule(moduleName);
    setTranslation(moduleName, translation);

    const readStoreAction = () => getRequest(moduleName);

    if (!components.base) {
        components.base = defineComponent({
            name: `${moduleName}-base`,
            // TODO :: find out if the minimal router view actually works as intended
            render: () => h(MinimalRouterView, {depth: 1}),
            // render: () => h(RouterView),
            // TODO #9 @Goosterhof
            mounted: readStoreAction,
        });
    }

    const routeSettings = RouteSettingFactory(
        moduleName,
        components.base,
        components.overview,
        components.create,
        components.edit,
        components.show
    );

    return {
        routeSettings,
        /** Go to the over view page fromm this controller */
        goToOverviewPage: () => goToRoute(routeSettings.overview.name.toString()),
        /**
         * Go the the show page for the given id
         *
         * @param {String} id id of item to go to the show page
         */
        goToShowPage: id => goToRoute(routeSettings.show.name.toString(), id),
        /**
         * Go to the edit page for this controller
         *
         * @param {String} id
         * @param {LocationQuery} [query] the optional query for the new route
         */
        goToEditPage: (id, query) => goToRoute(routeSettings.edit.name.toString(), id, query),
        /**
         * Go to the create page for this controller
         *
         * @param {LocationQuery} [query] the optional query for the new route
         */
        goToCreatePage: query => goToRoute(routeSettings.create.name.toString(), undefined, query),
        /**
         * Sends a delete request to the server.
         * Delete's the given id from the server
         *
         * @param {number} id the id to delete from the server
         */
        destroyStoreAction: id =>
            deleteRequest(`${moduleName}/${id}`).then(response => {
                // deleteFromStore?
                return response;
            }),

        /**
         * Sends a post request to the server, which updates the given item on the server
         *
         * @param {Item} item the item to be updated
         */
        updateStoreAction: item => postRequest(`${moduleName}/${item.id}`, item),

        /**
         * Sends a post request to the server, which creates the item on the server
         *
         * @param {Item} item the item to be created
         */
        createStoreAction: item => postRequest(moduleName, item),
        /**
         * Sends a get request to the server, which returns all items on the server from that endpoint
         */
        readStoreAction,

        /**
         * Sends a get request to the server, which returns a single item on the server based on the given id
         *
         * @param {Number} id the id to be read
         */
        showStoreAction: id => getRequest(`${moduleName}/${id}`),

        /**
         * Sends a get request to the server, which returns a single item on the server based on the given id
         *
         * @param {Number} id the id to be read
         */
        showStoreActionByCurrentRouteId: () => getRequest(`${moduleName}/${getCurrentRouteId()}`),

        /**
         * get all items from the store from this controller
         */
        get getAll() {
            // TODO :: test this
            return getAllFromStore(moduleName);
        },
        /**
         * Get an item from the store based on the given id
         * @param {String} id get the item from the store based on id
         */
        getById: id => getByIdFromStore(moduleName, id),

        /**
         * Get an item based on the current route id
         */
        get getByCurrentRouteId() {
            return getByIdFromStore(moduleName, getCurrentRouteId());
        },

        /**
         * Init the controller.
         * This will register the routes.
         */
        init: () => addRoutesBasedOnRouteSettings(routeSettings),
    };
};

// import MinimalRouterView from '../components/MinimalRouterView';
// import {storeService, routerService, eventService, translatorService} from '../services';

// export class BaseController {
//     /** The standard message to show in the destroy modal */
//     get destroyModalMessage() {
//         return `Weet je zeker dat je deze ${this._translatorService.getSingular(this.APIEndpoint)} wil verwijderen?`;
//     }

//     /** Shows a modal with the standard destroy modal message. On OK will send a destroy request based on the current route id */
//     get destroyByCurrentRouteIdModal() {
//         return () => this._eventService.modal(this.destroyModalMessage, this.destroyByCurrentRouteId);
//     }

//     /**
//      * Shows a modal with the standard destroy modal message. On OK will send a destroy request based on the given id
//      * @param {String|Number} id
//      */
//     get destroyByIdModal() {
//         return id => this._eventService.modal(this.destroyModalMessage, () => this.destroyByIdWithoutRouteChange(id));
//     }

//     /**
//      * pops up a modal with the given message
//      * @param {String} message the message being shown by the modal
//      * @param {Function} okAction the function being used when click on ok
//      * @param {Function} [cancelAction] the being used when click on cancel
//      */
//     popModal(message, okAction, cancelAction) {
//         this._eventService.modal(message, okAction, cancelAction);
//     }
// }

export { index as moduleFactory, startApp };

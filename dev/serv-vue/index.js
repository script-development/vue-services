import {ref, computed, createApp, defineComponent, h} from 'vue';
import {createRouter, createWebHistory} from 'vue-router';
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
            cantSeeWhenLoggedIn: false,
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
var RouteSettingFactory = (
    moduleName,
    baseComponent,
    overviewComponent,
    createComponent,
    editComponent,
    showComponent
) => {
    const routeSettings = {
        base: {
            path: '/' + getPluralTranslation(moduleName),
            component: baseComponent,
            meta: {moduleName},
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

/** @param {NavigationGuard} middleware */
const registerBeforeMiddleware = middleware => routerBeforeMiddleware.push(middleware);

/** @type {NavigationHookAfter[]} */
const routerAfterMiddleware = [];
router.afterEach((to, from) => {
    for (const middlewareFunc of routerAfterMiddleware) {
        middlewareFunc(to, from);
    }
});

/** @param {NavigationHookAfter} middleware */
const registerAfterMiddleware = middleware => routerAfterMiddleware.push(middleware);

/** @param {RouteRecordRaw} routes */
const addRoute = routes => router.addRoute(routes);

/** @param {RouteSettings} settings */
const addRoutesBasedOnRouteSettings = settings => {
    // getting the record from the settings
    const record = settings.base;
    // deleting the record from settings, since it's not it's own child
    delete settings.base;
    record.children = Object.values(settings);
    addRoute(record);
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

/**
 * Go to the show page for the given module name
 * @param {string} moduleName name of the module to go to the show page to
 * @param {string} id the id for the given item to show
 */
const goToShowPage = (moduleName, id) => goToRoute(moduleName + SHOW_PAGE_NAME, id);
/**
 * Go to the edit page for the given module name
 * @param {string} moduleName name of the module to go to the edit page to
 * @param {string} id the id for the given item to edit
 */
const goToEditPage = (moduleName, id) => goToRoute(moduleName + EDIT_PAGE_NAME, id);
/**
 * Go to the create page for the given module name
 * @param {string} moduleName name of the module to go to the create page to
 */
const goToCreatePage = moduleName => goToRoute(moduleName + CREATE_PAGE_NAME);
/**
 * Go to the overview page for the given module name
 * @param {string} moduleName name of the module to go to the overview page to
 */
const goToOverviewPage = moduleName => goToRoute(moduleName + OVERVIEW_PAGE_NAME);

/** Get the current route */
const getCurrentRoute = () => router.currentRoute;
/** Get the query from the current route */
const getCurrentRouteQuery = () => router.currentRoute.value.query;
/** Get the id from the params from the current route */
const getCurrentRouteId = () => router.currentRoute.value.params.id.toString();
/**
 * Get the module name binded to the current route
 * @returns {string}
 */
const getCurrentRouteModuleName = () => router.currentRoute.value.meta?.moduleName;

/**
 * checks if the given string is in the current routes name
 * @param {string} pageName the name of the page to check
 */
const onPage = pageName => router.currentRoute.value.name?.toString().includes(pageName);

/**
 * Checks if the page name exists in the routes
 * @param {string} pageName
 */
const hasPageName = pageName => router.hasRoute(pageName);

/**
 * returns if the given module name has a create page
 * @param {string} moduleName
 */
const hasCreatePage = moduleName => hasPageName(moduleName + CREATE_PAGE_NAME);
/**
 * returns if the given module name has an edit page
 * @param {string} moduleName
 */
const hasEditPage = moduleName => hasPageName(moduleName + EDIT_PAGE_NAME);
/**
 * returns if the given module name has a show page
 * @param {string} moduleName
 */
const hasShowPage = moduleName => hasPageName(moduleName + SHOW_PAGE_NAME);

/** go back one page */
const goBack = () => router.back();

var LoginPage = {
    render(h) {
        h('div', ['Implement your own login page!']);
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
const HEADERS_TO_TYPE = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'application/xlsx',
};

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

/**
 * download a file from the backend
 * type should be resolved automagically, if not, then you can pass the type
 * @param {String} endpoint the endpoint for the download
 * @param {String} documentName the name of the document to be downloaded
 * @param {String} [type] the downloaded document type
 */
const download = async (endpoint, documentName, type) =>
    http.get(endpoint, {responseType: 'blob'}).then(response => {
        if (!type) type = HEADERS_TO_TYPE[response.headers['content-type']];
        const blob = new Blob([response.data], {type});
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = documentName;
        link.click();
        return response;
    });

/** @param {ResponseMiddleware} middlewareFunc */
const registerResponseMiddleware = middlewareFunc => responseMiddleware.push(middlewareFunc);

/** @param {ResponseErrorMiddleware} middlewareFunc */
const registerResponseErrorMiddleware = middlewareFunc => responseErrorMiddleware.push(middlewareFunc);

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

/** Empty the storage */
const clearStorage = () => {
    // TODO :: Stryker ConditionalExpression survived, when mutated to false
    if (!keepALive) return;
    localStorage.clear();
};

/** @param {Boolean} value */
const setKeepALive = value => {
    localStorage.setItem(KEEP_A_LIVE_KEY, JSON.stringify(value));
    keepALive = value;
};

/** *
 * @typedef {import('vue').Component} Component
 * @typedef {import('vue-router').NavigationGuard} NavigationGuard
 *
 * @typedef {import('../../../types/types').LoginCredentials} LoginCredentials
 * @typedef {import('../../../types/types').ResetPasswordData} ResetPasswordData
 * @typedef {import('../../../types/types').ResponseErrorMiddleware} ResponseErrorMiddleware
 * @typedef {import('../../../types/types').IsLoggedIn} IsLoggedIn
 * @typedef {import('../../../types/types').LoggedInUser} LoggedInUser
 * @typedef {import('../../../types/types').Item} Item
 */

const LOGIN_ROUTE_NAME = 'Login';
const FORGOT_PASSWORD_ROUTE_NAME = 'ForgotPassword';
const RESET_PASSWORD_ROUTE_NAME = 'ResetPassword';
const SET_PASSWORD_ROUTE_NAME = 'SetPassword';

const APP_NAME = process.env.MIX_APP_NAME || 'Harry';
const IS_LOGGED_IN_KEY = APP_NAME + ' is magical';
const LOGGED_IN_USER_KEY = APP_NAME + ' is supreme';

const apiLoginRoute = '/login';
const apiLogoutRoute = '/logout';

let defaultLoggedInPageName;

/** @type {Component} */
let resetPasswordPage = ResetPasswordPage;
/** @type {Component} */
let loginPage = LoginPage;
/** @type {Component} */
let forgotPasswordPage;
/** @type {Component} */
let setPasswordPage;

/** @param {Component} page */
const setResetPasswordPage = page => (resetPasswordPage = page);
/** @param {Component} page */
const setLoginPage = page => (loginPage = page);
/** @param {Component} page */
const setForgotPasswordPage = page => (forgotPasswordPage = page);
/** @param {Component} page */
const setSetPasswordPage = page => (setPasswordPage = page);

/**
 * Set the default logged in page name
 * @param {string} name
 */
const setDefaultLoggedInPageName = name => (defaultLoggedInPageName = name);
const goToDefaultLoggedInPage = () => {
    if (!defaultLoggedInPageName) {
        throw new MissingDefaultLoggedinPageError('Please add the default login page to the appStarter');
    }
    goToRoute(defaultLoggedInPageName);
};

const goToLoginPage = () => goToRoute(LOGIN_ROUTE_NAME);

/** @type {IsLoggedIn} */
const isLoggedIn = ref(getItemFromStorage(IS_LOGGED_IN_KEY, true) || false);
/** @type {LoggedInUser} */
const loggedInUser = ref(getItemFromStorage(LOGGED_IN_USER_KEY, true) || {});

// exported for testing purposes, not exported to the user
/** @type {ResponseErrorMiddleware} */
const responseErrorMiddleware$1 = ({response}) => {
    if (!response) return;
    const {status} = response;
    // TODO :: make this work
    if (status == 403) {
        goToDefaultLoggedInPage();
    } else if (status == 401) {
        // TODO :: if 401 returns, is it really logged out from the server?
        // only need to logout of the app, because on the backend the user is already logged out
        logoutOfApp();
    }
};

registerResponseErrorMiddleware(responseErrorMiddleware$1);

// TODO :: maybe even add the possibility to add auth middleware here?
// or push it directly to the router?
// exported for testing purposes, not exported to the user
/** @type {NavigationGuard} */
const beforeMiddleware$1 = ({meta}) => {
    if (!isLoggedIn.value && meta.auth) {
        goToLoginPage();
        return true;
    }

    if (isLoggedIn.value && meta.cantSeeWhenLoggedIn) {
        goToDefaultLoggedInPage();
        return true;
    }

    return false;
};

registerBeforeMiddleware(beforeMiddleware$1);

/** @param {Item} user */
const setLoggedInAndUser = user => {
    // set the logged in user
    loggedInUser.value = user;
    setItemInStorage(LOGGED_IN_USER_KEY, user);
    // set is logged in
    isLoggedIn.value = true;
    setItemInStorage(IS_LOGGED_IN_KEY, true);
};

const logoutOfApp = () => {
    clearStorage();
    // TODO :: or reload state? transition from this is not rly smooth
    window.location.reload();
};

/**
 *
 * @param {LoginCredentials} credentials
 */
const login = async credentials => {
    setKeepALive(credentials.rememberMe);
    return postRequest(apiLoginRoute, credentials).then(response => {
        setLoggedInAndUser(response.data.user);
        goToDefaultLoggedInPage();
        return response;
    });
};

const logout = async () => {
    return postRequest(apiLogoutRoute, {}).then(response => {
        logoutOfApp();
        return response;
    });
};

const setAuthRoutes = () => {
    addRoute({
        path: '/inloggen',
        name: LOGIN_ROUTE_NAME,
        component: loginPage,
        meta: {auth: false, cantSeeWhenLoggedIn: true, title: 'Login'},
    });

    addRoute({
        path: '/wachtwoord-resetten',
        name: RESET_PASSWORD_ROUTE_NAME,
        component: resetPasswordPage,
        meta: {auth: false, cantSeeWhenLoggedIn: true, title: 'Wachtwoord resetten'},
    });

    if (forgotPasswordPage) {
        addRoute({
            path: '/wachtwoord-resetten',
            name: FORGOT_PASSWORD_ROUTE_NAME,
            component: forgotPasswordPage,
            meta: {auth: false, cantSeeWhenLoggedIn: true, title: 'Wachtwoord vergeten'},
        });
    }

    if (setPasswordPage) {
        addRoute({
            path: '/wachtwoord-setten',
            name: SET_PASSWORD_ROUTE_NAME,
            component: setPasswordPage,
            meta: {auth: false, cantSeeWhenLoggedIn: true, title: 'Wachtwoord setten'},
        });
    }
};

class StoreModuleNotFoundError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        this.name = 'StoreModuleNotFoundError';
    }
}

/**
 * @typedef {import('../../../../types/types').State} State
 * @typedef {import('../../../../types/types').Item} Item
 * @typedef {import('../../../../types/services/store').StoreModule} StoreModule
 */

// TODO :: it makes it a lot easier if we only handle id based items
// changing it to only id based items, need to check if it can handle it
// TODO :: JSDoc and vsCode can't handle the Item|Item[] parameter

/**
 * Makes a deep copy
 * If it's not an object or array, it will return toCopy
 *
 * @param {any} toCopy Can be anything to make a copy of
 */
const deepCopy = toCopy => {
    if (typeof toCopy !== 'object' || toCopy === null) {
        return toCopy;
    }

    const copiedObject = Array.isArray(toCopy) ? [] : {};

    for (const key in toCopy) {
        copiedObject[key] = deepCopy(toCopy[key]);
    }

    return copiedObject;
};

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
         */
        byId: id => computed(() => state.value[id]),
        /**
         * Set data in the state.
         * Data can be of any kind.
         *
         * @param {Item|Item[]} data the data to set
         */
        setAll: originalData => {
            const data = deepCopy(originalData);
            if (!data.length) {
                // if data is not an array it probably recieves a single item with an id
                // if that's not the case then return
                if (!data.id) return;

                // TODO :: vue-3 :: check if vue-3 is reactive this way
                state.value[data.id] = Object.freeze(data);
            } else if (data.length === 1) {
                // if data has an array with 1 entry, put it in the state
                state.value[data[0].id] = Object.freeze(data[0]);
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

                    state.value[newData.id] = Object.freeze(newData);
                }

                // put all remaining new data in the state
                for (const newData of data) {
                    state.value[newData.id] = Object.freeze(newData);
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
 * @typedef {import('../../../types/services/store').Store} Store
 * @typedef {import('../../../types/services/store').registerStoreModule} registerStoreModule
 * @typedef {import('../../../types/services/store').StoreModuleFactory} StoreModuleFactory
 * @typedef {import('../../../types/types').StaticDataTypes} StaticDataTypes
 */

/**
 * Define msgpack for later use
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

const apiStaticDataEndpoint = 'staticdata';

/** Exporting for testing purposes */
const DATA = {
    normal: [],
    msgpack: [],
};

/**
 * Exporting for testing purposes
 *
 * @type {Store}
 */
const store$1 = {};

/**
 * initiates the setup for the default store modules
 *
 * @param {StaticDataTypes} data
 */
const createStaticDataStoreModules = data => {
    for (const staticDataNameOrObject of data) {
        if (typeof staticDataNameOrObject == 'string') {
            store$1[staticDataNameOrObject] = StoreModuleFactory(staticDataNameOrObject);
            DATA.normal.push(staticDataNameOrObject);
            continue;
        }

        for (const staticDataName in staticDataNameOrObject) {
            if (staticDataNameOrObject[staticDataName] === MSG_PACK_DATA_TYPE) {
                createStoreModuleMsgPack(staticDataName);
            }
        }
    }
};

/**
 * Create module for static data with msg-pack lite(peerDependencies)
 *
 * @param {string} staticDataName
 */
const createStoreModuleMsgPack = staticDataName => {
    if (!msgpack) {
        console.error('MESSAGE PACK NOT INSTALLED');
        return console.warn('run the following command to install messagepack: npm --save @msgpack/msgpack');
    }
    store$1[staticDataName] = StoreModuleFactory(staticDataName);
    DATA.msgpack.push(staticDataName);
};

/**
 * Sends requests to the server which recieves all the staticdata from the server defined in DATA
 */
const getStaticDataFromServer = async () => {
    const response = await getRequest(apiStaticDataEndpoint);

    for (const staticDataName of DATA.normal) {
        store$1[staticDataName].setAll(response.data[staticDataName]);
    }

    for (const staticDataName of DATA.msgpack) {
        const response = await getRequest(staticDataName, {responseType: 'arraybuffer'});

        store$1[staticDataName].setAll(msgpack.decode(new Uint8Array(response.data)));
    }
};

/**
 * Get all from a specific segment in the staticdata store
 *
 * @param {string} staticDataName the name of the segement to get data from
 */
const getStaticDataSegment = staticDataName => store$1[staticDataName].all.value;

/**
 * Get all data from the given staticDataName by id
 *
 * @param {string} staticDataName the name of the segement to get data from
 * @param {string} id the id of the data object to get
 */
const getStaticDataItemById = (staticDataName, id) => store$1[staticDataName].byId(id).value;

/**
 * @typedef {import('vue').Component} Component
 *
 * @typedef {import('../../types/types').Modules} Modules
 * @typedef {import('../../types/types').AuthComponents} AuthComponents
 * @typedef {import('../../types/types').StaticDataTypes} StaticDataTypes
 */

/**
 * Start the app.
 * Set required settings.
 * Init the modules.
 * Set the static data.
 *
 * @param {Component} mainComponent the main app component
 * @param {Modules} modules the login page
 * @param {string} defaultLoggedInPageName the page to go to when logged in
 * @param {AuthComponents} authComponents the page to go to when logged in
 * @param {StaticDataTypes} [staticData] the static data
 */
const startApp = (mainComponent, modules, defaultLoggedInPageName, authComponents, staticData) => {
    setDefaultLoggedInPageName(defaultLoggedInPageName);
    // set auth pages
    setLoginPage(authComponents.login);
    setResetPasswordPage(authComponents.resetPassword);
    if (authComponents.forgotPassword) setForgotPasswordPage(authComponents.forgotPassword);
    if (authComponents.setPassword) setSetPasswordPage(authComponents.setPassword);
    // set auth routes
    setAuthRoutes();

    if (staticData) createStaticDataStoreModules(staticData);

    for (const moduleName in modules) modules[moduleName].init();

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
        return () => {
            const matched = getCurrentRoute().value.matched[props.depth];
            const component = matched && matched.components[name];
            // render empty node if no matched route or no config component
            if (!matched || !component) {
                return () => h('div', [404]);
            }
            return h(component);
        };
    },
});

/**
 * @typedef {import('vue-router').LocationQuery} LocationQuery
 *
 * @typedef {import('../../types/types').Item} Item
 * @typedef {import('../../types/types').Translation} Translation
 * @typedef {import('../../types/module').ModuleFactoryComponents} ModuleFactoryComponents
 * @typedef {import('../../types/module').Module} Module
 *
 */

// TODO :: refactor to more readable code

/**
 * @param {string} moduleName
 * @param {ModuleFactoryComponents} components
 * @param {Translation} translation
 *
 * @returns {Module}
 */
const moduleFactory = (moduleName, components, translation) => {
    generateAndRegisterDefaultStoreModule(moduleName);
    setTranslation(moduleName, translation);

    const createdModule = {
        /**
         * Sends a delete request to the server.
         * Delete's the given id from the server
         *
         * @param {string} id the id to delete from the server
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
         * Sends a get request to the server, which returns a single item on the server based on the given id
         *
         * @param {string} id the id to be read
         */
        showStoreAction: id => getRequest(`${moduleName}/${id}`),

        /**
         * Sends a get request to the server, which returns a single item on the server based on the given id
         *
         * @param {string} id the id to be read
         */
        showStoreActionByCurrentRouteId: () => getRequest(`${moduleName}/${getCurrentRouteId()}`),

        /**
         * get all items from the store from this controller
         */
        get getAll() {
            return getAllFromStore(moduleName);
        },
        /**
         * Get an item from the store based on the given id
         * @param {string} id get the item from the store based on id
         */
        getById: id => getByIdFromStore(moduleName, id),

        /**
         * Get an item based on the current route id
         */
        get getByCurrentRouteId() {
            return getByIdFromStore(moduleName, getCurrentRouteId());
        },
    };

    /**
     * Sends a get request to the server, which returns all items on the server from that endpoint
     */
    createdModule.readStoreAction = () => getRequest(moduleName);

    if (!components.base) {
        components.base = defineComponent({
            name: `${moduleName}-base`,
            // TODO :: check if this works in every case
            render: () => h(MinimalRouterView, {depth: 1}),
            // render: () => h(RouterView),
            // TODO #9 @Goosterhof
            mounted: createdModule.readStoreAction,
        });
    }

    createdModule.routeSettings = RouteSettingFactory(
        moduleName,
        components.base,
        components.overview,
        components.create,
        components.edit,
        components.show
    );

    /** Go to the over view page fromm this controller */
    createdModule.goToOverviewPage = () => goToRoute(createdModule.routeSettings.overview.name.toString());
    /**
     * Go the the show page for the given id
     *
     * @param {string} id id of item to go to the show page
     */
    createdModule.goToShowPage = id => goToRoute(createdModule.routeSettings.show.name.toString(), id);
    /**
     * Go to the edit page for this controller
     *
     * @param {string} id
     * @param {LocationQuery} [query] the optional query for the new route
     */
    createdModule.goToEditPage = (id, query) => goToRoute(createdModule.routeSettings.edit.name.toString(), id, query);
    /**
     * Go to the create page for this controller
     *
     * @param {LocationQuery} [query] the optional query for the new route
     */
    createdModule.goToCreatePage = query =>
        goToRoute(createdModule.routeSettings.create.name.toString(), undefined, query);

    /**
     * Init the controller.
     * This will register the routes.
     */
    createdModule.init = () => addRoutesBasedOnRouteSettings(createdModule.routeSettings);

    return createdModule;
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

/**
 * Extra toast styling, for the animations
 */
const style = document.createElement('style');
document.head.appendChild(style);

style.sheet.insertRule('.show-toast {animation: fadein 0.5s;}');
style.sheet.insertRule('.hide-toast {animation: fadeout 0.5s;}');
style.sheet.insertRule(`@keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;}}`);
style.sheet.insertRule(`@keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }`);

const VARIANTS = [
    'danger',
    'success',
    'primary',
    'secondary',
    'warning',
    'info',
    'light',
    'dark',
    'white',
    'transparent',
];

/** @param {string} variant */
const validVariant = variant => VARIANTS.includes(variant);

const ToastComponent = defineComponent({
    props: {
        message: {type: String, required: true},
        show: {type: Boolean, required: true},
        variant: {type: String, required: false, default: 'success', validator: validVariant},
    },
    setup: (props, ctx) => {
        const closeButton = h('button', {
            class: 'btn-close ml-auto mr-2',
            onclick: () => {
                if (props.show) ctx.emit('hide');
            },
        });

        const messageElement = h('div', {class: 'toast-body'}, [props.message]);

        const variant = `bg-${props.variant}`;

        return () => {
            // need to define classes here, to make it reactive when props.show changes
            const classes = [
                'toast d-flex align-items-center border-0',
                variant,
                props.show ? 'show-toast' : 'hide-toast',
            ];
            return h('div', {class: classes, style: {opacity: 1}}, [messageElement, closeButton]);
        };
    },
});

const ModalComponent = defineComponent({
    props: {
        id: {
            type: String,
            required: false,
        },

        title: {
            type: String,
            required: false,
        },
        titleTag: {
            type: String,
            required: false,
            default: 'h5',
        },
        titleClass: {
            type: String,
            required: false,
        },

        message: {
            type: String,
            required: false,
        },

        // TODO :: could use translations to default this
        okTitle: {
            type: String,
            required: false,
            default: 'Ok',
        },
        okAction: {
            type: Function,
            required: true,
        },

        cancelTitle: {
            type: String,
            required: false,
            default: 'Cancel',
        },
        cancelAction: {
            type: Function,
            required: false,
        },
    },

    setup(props, ctx) {
        const closeModal = () => {
            if (props.cancelAction) props.cancelAction();
            ctx.emit('close');
        };

        const contentChildren = [];

        const headerChildren = [];
        if (props.title) {
            const titleOptions = {class: 'modal-title '};
            if (props.titleClass) titleOptions.class += props.titleClass;
            headerChildren.push(h(props.titleTag, titleOptions, [props.title]));
        }

        headerChildren.push(h('button', {class: 'btn-close', onclick: closeModal}));

        contentChildren.push(h('div', {class: 'modal-header'}, [headerChildren]));

        const bodyChildren = [];
        if (props.message) {
            bodyChildren.push(h('p', [props.message]));
        }
        contentChildren.push(h('div', {class: 'modal-body'}, [bodyChildren]));

        const footerChildren = [];
        if (props.cancelAction) {
            footerChildren.push(h('button', {class: 'btn btn-secondary', onclick: closeModal}, [props.cancelTitle]));
        }

        footerChildren.push(
            h(
                'button',
                {
                    class: 'btn btn-primary',
                    onclick: () => {
                        // TODO :: could probably use then / promises to only close when done with the action
                        props.okAction();
                        ctx.emit('close');
                    },
                },
                [props.okTitle]
            )
        );
        contentChildren.push(h('div', {class: 'modal-footer'}, [footerChildren]));

        const overLayOptions = {
            class: 'modal fade show',
            style: {display: 'block', 'background-color': 'rgba(0,0,0,0.4)'},
        };
        if (props.id) overLayOptions.id = props.id;

        return () =>
            h('div', overLayOptions, [
                h('div', {class: 'modal-dialog'}, [h('div', {class: 'modal-content'}, contentChildren)]),
            ]);
    },
});

/**
 * @typedef {import("vue").App} App
 *
 * @typedef {import("../../../types/types").ToastMessages} ToastMessages
 * @typedef {import("../../../types/types").ToastMessage} ToastMessage
 * @typedef {import("../../../types/types").ToastVariant} ToastVariant
 * @typedef {import("../../../types/types").Modals} Modals
 * @typedef {import("../../../types/types").Modal} Modal
 * @typedef {import("../../../types/types").ResponseMiddleware} ResponseMiddleware
 * @typedef {import("../../../types/types").ResponseErrorMiddleware} ResponseErrorMiddleware
 */

/** @type {ToastMessages} */
const toastMessages = ref([]);
/** @type {Modals} */
const modals = ref([]);

/**
 * The default duration for a toast message.
 * Can be overwritten.
 */
let defaultToastMessageDuration = 1500;

/**
 * Hide the toast message after a timeout and delete it from toastMessages
 * @param {ToastMessage} message
 */
const hideToastMessage = message => {
    clearTimeout(message.timeoutId);

    // TODO :: because this is called from render the ref becomes itself
    // and it's being called from the render function and outside the render function
    if (message.show.value) message.show.value = false;
    // @ts-ignore, see TODO above
    else if (message.show) message.show = false;

    message.timeoutId = setTimeout(() => {
        const index = toastMessages.value.findIndex(t => t.message === message.message);
        toastMessages.value.splice(index, 1);
    }, 450);
};

/**
 * Hide the toast message after the given duration
 *
 * @param {ToastMessage} message the message to remove after the delay
 */
const hideToastMessageAfterDelay = message => {
    clearTimeout(message.timeoutId);
    message.timeoutId = setTimeout(() => hideToastMessage(message), message.duration);
};

const eventApp = defineComponent({
    render() {
        if (modals.value.length) document.body.classList.add('modal-open');
        else document.body.classList.remove('modal-open');
        return [
            toastMessages.value.map(message => {
                return h(ToastComponent, {
                    message: message.message,
                    show: message.show,
                    variant: message.variant,
                    onHide: () => hideToastMessage(message),
                    // TODO :: what if there are two of the same messages active?
                    // this will trow error
                    key: message.message,
                });
            }),
            modals.value.map((modal, index) => {
                return h(ModalComponent, {
                    message: modal.message,
                    okAction: modal.okAction,
                    onClose: () => modals.value.splice(index, 1),
                });
            }),
        ];
    },
});

const eventContainer = document.createElement('div');
document.body.appendChild(eventContainer);
createApp(eventApp).mount(eventContainer);

/**
 * Create a toast message
 *
 * @param {string} message the message to show
 * @param {ToastVariant} [variant] the variant of the toast, default = success
 * @param {number} [duration] the duration the toast stays visisble, default = defaultToastMessageDuration
 */
const createToastMessage = (message, variant = 'success', duration = defaultToastMessageDuration) => {
    const toastMessage = {message, variant, duration, show: ref(true)};
    hideToastMessageAfterDelay(toastMessage);
    toastMessages.value.push(toastMessage);
};

/** @type {ResponseMiddleware} */
const responseMiddleware$2 = ({data}) => {
    if (data && data.message) createToastMessage(data.message);
};

registerResponseMiddleware(responseMiddleware$2);

/** @type {ResponseErrorMiddleware} */
const responseErrorMiddleware$2 = ({response}) => {
    if (response && response.data.message) createToastMessage(response.data.message, 'danger');
};

registerResponseErrorMiddleware(responseErrorMiddleware$2);

/**
 *
 * @param {Modal} modal
 */
const createModal = modal => modals.value.push(modal);

var NotFoundPage = {
    render() {
        return h('div', ['ERROR 404']);
    },
};

/**
 * @typedef {import('vue-router').NavigationHookAfter} NavigationHookAfter
 *
 * @typedef {import('../../../types/types').ResponseErrorMiddleware} ResponseErrorMiddleware
 * @typedef {import('../../../types/types').ErrorBagRef} ErrorBagRef
 */

/** @type {ErrorBagRef} */
const errors = ref({});

addRoute({
    path: '/:pathMatch(.*)*',
    name: 'not.found',
    component: NotFoundPage,
    meta: {title: 'Pagina niet gevonden', auth: true},
});

/** @type {NavigationHookAfter} */
const routeMiddleware = () => (errors.value = {});
registerAfterMiddleware(routeMiddleware);

/** @type {ResponseErrorMiddleware} */
const responseErrorMiddleware$3 = ({response}) => {
    if (response && response.data.errors) errors.value = response.data.errors;
};
registerResponseErrorMiddleware(responseErrorMiddleware$3);

const BaseFormError = defineComponent({
    props: {property: {type: String, required: true}},
    setup(props) {
        return () => {
            if (!errors.value[props.property]) return;
            return h('div', {class: 'invalid-feedback d-block'}, [errors.value[props.property][0]]);
        };
    },
});

export {
    BaseFormError,
    MinimalRouterView,
    addRoute,
    createModal,
    createToastMessage,
    download,
    getAllFromStore,
    getByIdFromStore,
    getCapitalizedPluralTranslation,
    getCapitalizedSingularTranslation,
    getCurrentRouteId,
    getCurrentRouteModuleName,
    getCurrentRouteQuery,
    getPluralTranslation,
    getRequest,
    getSingularTranslation,
    getStaticDataFromServer,
    getStaticDataItemById,
    getStaticDataSegment,
    goBack,
    goToCreatePage,
    goToEditPage,
    goToOverviewPage,
    goToRoute,
    goToShowPage,
    hasCreatePage,
    hasEditPage,
    hasShowPage,
    isLoggedIn,
    login,
    logout,
    moduleFactory,
    postRequest,
    startApp,
};

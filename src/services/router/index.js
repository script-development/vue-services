/**
 * @typedef {import("vue-router").RouteRecordRaw} RouteRecordRaw
 * @typedef {import("vue-router").NavigationGuard} NavigationGuard
 * @typedef {import("vue-router").NavigationHookAfter} NavigationHookAfter
 * @typedef {import('vue-router').LocationQuery} LocationQuery
 *
 * @typedef {import('../../../types/services/router').RouteSettings} RouteSettings
 */
// TODO :: how to fix this error? It's in RouteRecordRaw, create own definition?
import {createRouter, createWebHistory} from 'vue-router';
import {CREATE_PAGE_NAME, EDIT_PAGE_NAME, OVERVIEW_PAGE_NAME, SHOW_PAGE_NAME} from './settings';

// exported only to use in the app starter to bind the router
export const router = createRouter({
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
export const beforeMiddleware = (to, from) => {
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
export const registerBeforeMiddleware = middleware => routerBeforeMiddleware.push(middleware);

/** @type {NavigationHookAfter[]} */
const routerAfterMiddleware = [];
router.afterEach((to, from) => {
    for (const middlewareFunc of routerAfterMiddleware) {
        middlewareFunc(to, from);
    }
});

/** @param {NavigationHookAfter} middleware */
export const registerAfterMiddleware = middleware => routerAfterMiddleware.push(middleware);

/** @param {RouteRecordRaw} routes */
export const addRoute = routes => router.addRoute(routes);

/** @param {RouteSettings} settings */
export const addRoutesBasedOnRouteSettings = settings => {
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
export const goToRoute = (name, id, query) => {
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
export const goToShowPage = (moduleName, id) => goToRoute(moduleName + SHOW_PAGE_NAME, id);
/**
 * Go to the edit page for the given module name
 * @param {string} moduleName name of the module to go to the edit page to
 * @param {string} id the id for the given item to edit
 */
export const goToEditPage = (moduleName, id) => goToRoute(moduleName + EDIT_PAGE_NAME, id);
/**
 * Go to the create page for the given module name
 * @param {string} moduleName name of the module to go to the create page to
 */
export const goToCreatePage = moduleName => goToRoute(moduleName + CREATE_PAGE_NAME);

/** Get the current route */
export const getCurrentRoute = () => router.currentRoute;
/** Get the query from the current route */
export const getCurrentRouteQuery = () => router.currentRoute.value.query;
/** Get the id from the params from the current route */
export const getCurrentRouteId = () => router.currentRoute.value.params.id.toString();
/** Get the name from the current route */
export const getCurrentRouteName = () => router.currentRoute.value.name.toString();
/**
 * Get the module name binded to the current route
 * @returns {string}
 */
export const getCurrentRouteModuleName = () => router.currentRoute.value.meta?.moduleName;

/**
 * checks if the given string is in the current routes name
 * @param {string} pageName the name of the page to check
 */
const onPage = pageName => router.currentRoute.value.name?.toString().includes(pageName);

export const onCreatePage = () => onPage(CREATE_PAGE_NAME);
/** returns if you are on the edit page */
export const onEditPage = () => onPage(EDIT_PAGE_NAME);
/** returns if you are on the overview page */
export const onOverviewPage = () => onPage(OVERVIEW_PAGE_NAME);
/** returns if you are on the show page */
export const onShowPage = () => onPage(SHOW_PAGE_NAME);

/**
 * Checks if the page name exists in the routes
 * @param {string} pageName
 */
const hasPageName = pageName => router.hasRoute(pageName);

/**
 * returns if the given module name has a create page
 * @param {string} moduleName
 */
export const hasCreatePage = moduleName => hasPageName(moduleName + CREATE_PAGE_NAME);
/**
 * returns if the given module name has an edit page
 * @param {string} moduleName
 */
export const hasEditPage = moduleName => hasPageName(moduleName + EDIT_PAGE_NAME);
/**
 * returns if the given module name has an overview page
 * @param {string} moduleName
 */
export const hasOverviewPage = moduleName => hasPageName(moduleName + OVERVIEW_PAGE_NAME);
/**
 * returns if the given module name has a show page
 * @param {string} moduleName
 */
export const hasShowPage = moduleName => hasPageName(moduleName + SHOW_PAGE_NAME);

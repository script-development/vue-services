/**
 * @typedef {import("vue-router").RouteRecord} RouteRecord
 * @typedef {import("vue-router").NavigationGuard} NavigationGuard
 * @typedef {import("vue-router").NavigationHookAfter} NavigationHookAfter
 * @typedef {import('vue-router').LocationQuery} LocationQuery
 *
 * @typedef {import("./factory").RouteFactory} RouteFactory
 * @typedef {import("./settings").RouteSettings} RouteSettings
 */

import {createRouter, createWebHistory} from 'vue-router';
import {CREATE_PAGE_NAME, EDIT_PAGE_NAME, OVERVIEW_PAGE_NAME, SHOW_PAGE_NAME} from './settings';

const router = createRouter({
    history: createWebHistory(),
    routes: [],
});

/**
 * Checks if there is a target route name in the route query
 * If there is, it will redirect to that route
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

/** @param {RouteRecord} routes */
export const addRoutes = routes => router.options.routes.push(routes);

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

/** Get the query from the current route */
export const getCurrentRouteQuery = () => router.currentRoute.value.query;
/** Get the id from the params from the current route */
export const getCurrentRouteId = () => router.currentRoute.value.params.id;
/** Get the name from the current route */
export const getCurrentRouteName = () => router.currentRoute.value.name;

/**
 * checks if the given string is in the current routes name
 * @param {string} pageName the name of the page to check
 */
const onPage = pageName => getCurrentRouteName().toString().includes(pageName);

export const onCreatePage = () => onPage(CREATE_PAGE_NAME);
/** returns if you are on the edit page */
export const onEditPage = () => onPage(EDIT_PAGE_NAME);
/** returns if you are on the overview page */
export const onOverviewPage = () => onPage(OVERVIEW_PAGE_NAME);
/** returns if you are on the show page */
export const onShowPage = () => onPage(SHOW_PAGE_NAME);

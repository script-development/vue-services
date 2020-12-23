import {Component, Ref} from 'vue';
import {
    LocationQuery,
    NavigationGuard,
    NavigationHookAfter,
    RouteLocationNormalizedLoaded,
    RouteRecordRaw,
} from 'vue-router';

export type RouteSettings = {
    base: RouteRecordRaw;
    create?: RouteRecordRaw;
    overview?: RouteRecordRaw;
    edit?: RouteRecordRaw;
    show?: RouteRecordRaw;
    [extraRoutes: string]: RouteRecordRaw;
};

/**
 * Creates standard route settings.
 * Creates settings for the optional routes when the components are given.
 * Does not add the optional routes otherwise.
 */
export function RouteSettingFactory(
    moduleName: string,
    baseComponent: Component,
    overviewComponent?: Component,
    createComponent?: Component,
    editComponent?: Component,
    showComponent?: Component
): RouteSettings;

export function registerBeforeMiddleware(middleware: NavigationGuard): void;

export function registerAfterMiddleware(middleware: NavigationHookAfter): void;

export function addRoute(routes: RouteRecordRaw): void;

export declare function addRoutesBasedOnRouteSettings(settings: RouteSettings): RouteRecordRaw;

/**
 * Go to the give route by name, optional id and query
 * If going to a route you are already on, it catches the given error
 *
 * @param {String} name the name of the new route
 * @param {String} [id] the optional id for the params of the new route
 * @param {LocationQuery} [query] the optional query for the new route
 */
export function goToRoute(name: string, id?: string, query?: LocationQuery): void;
/** Go to the show page for the given module name */
export function goToShowPage(moduleName: string, id: string): void;
/** Go to the edit page for the given module name */
export function goToEditPage(moduleName: string, id: string): void;
/** Go to the show page for the given module name */
export function goToCreatePage(moduleName: string): void;

export function getCurrentRoute(): Ref<RouteLocationNormalizedLoaded>;
/** Get the query from the current route */
export function getCurrentRouteQuery(): LocationQuery;
/** Get the id from the params from the current route */
export function getCurrentRouteId(): string;
/** Get the name from the current route */
export function getCurrentRouteName(): string;
/** Get the module name binded to the current route */
export function getCurrentRouteModuleName(): string;

/** returns if you are on the create page */
export function onCreatePage(): boolean;
/** returns if you are on the edit page */
export function onEditPage(): boolean;
/** returns if you are on the overview page */
export function onOverviewPage(): boolean;
/** returns if you are on the show page */
export function onShowPage(): boolean;

/** returns if the given module name has a create page */
export function hasCreatePage(moduleName: string): boolean;
/** returns if the given module name has an edit page */
export function hasEditPage(moduleName: string): boolean;
/** returns if the given module name has an overview page */
export function hasOverviewPage(moduleName: string): boolean;
/** returns if the given module name has a show page */
export function hasShowPage(moduleName: string): boolean;

/** go back one page */
export function goBack(): void;

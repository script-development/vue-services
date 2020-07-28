/**
 * @typedef {import("vue-router").RouteConfig} RouteConfig
 * @typedef {import("vue-router").Route} Route
 * @typedef {import("vue-router").default} VueRouter
 * @typedef {import("./factory").RouteFactory} RouteFactory
 * @typedef {import("./settings").RouteSettings} RouteSettings
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
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

export class RouterService {
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

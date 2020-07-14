import {TranslatorService} from './services';
import {ComponentOptions, DefaultData, DefaultMethods, DefaultComputed, PropsDefinition} from 'vue/types/options';
import {RouteConfig, Route} from 'vue-router/types/index';

import VueRouter from 'vue-router/types/index';

export class RouteSettings {
    /**
     * @param {TranslatorService} translationService
     */
    constructor(translationService: TranslatorService);
    _translationService: TranslatorService;
    _editPath: string;
    _showPath: string;
    _overviewPath: string;
    _createPath: string;
    /** show page settings */
    _showPageAdminOnly: any;
    _showPageAuthOnly: any;
    /** overview page settings */
    _overviewPageAdminOnly: any;
    _overviewPageAuthOnly: any;
    /** edit page settings */
    _editPageAdminOnly: any;
    _editPageAuthOnly: any;
    /** create page settings */
    _createPageAdminOnly: any;
    _createPageAuthOnly: any;
    /** returns the create name part of the route */
    get createPageName(): string;
    /** returns the edit name part of the route */
    get editPageName(): string;
    /** returns the overview name part of the route */
    get overviewPageName(): string;
    /** returns the show name part of the route */
    get showPageName(): string;
    set showPageAdminOnly(arg: any);
    /** returns if the show page is only accessible by the admin */
    get showPageAdminOnly(): any;
    set showPageAuthOnly(arg: any);
    /** returns if the show page is only accessible by authenticated users */
    get showPageAuthOnly(): any;
    set overviewPageAdminOnly(arg: any);
    /** returns if the overview page is only accessible by the admin */
    get overviewPageAdminOnly(): any;
    set overviewPageAuthOnly(arg: any);
    /** returns if the overview page is only accessible by authenticated users */
    get overviewPageAuthOnly(): any;
    set editPageAdminOnly(arg: any);
    /** returns if the edit page is only accessible by the admin */
    get editPageAdminOnly(): any;
    set editPageAuthOnly(arg: any);
    /** returns if the edit page is only accessible by authenticated users */
    get editPageAuthOnly(): any;
    set createPageAdminOnly(arg: any);
    /** returns if the create page is only accessible by the admin */
    get createPageAdminOnly(): any;
    set createPageAuthOnly(arg: any);
    /** returns if the create page is only accessible by authenticated users */
    get createPageAuthOnly(): any;
    /** @param {String} value name of the base route */
    set baseName(arg: string);
    /** @returns {String} */
    get baseName(): string;
    _baseName: string;
    /** @param {String} value name of the route */
    set editName(arg: string);
    /** @returns {String} */
    get editName(): string;
    _editName: string;
    /** @param {String} value name of the route */
    set showName(arg: string);
    /** @returns {String} */
    get showName(): string;
    _showName: string;
    /** @param {String} value name of the route */
    set createName(arg: string);
    /** @returns {String} */
    get createName(): string;
    _createName: string;
    /** @param {String} value name of the route */
    set overviewName(arg: string);
    /** @returns {String} */
    get overviewName(): string;
    _overviewName: string;
    /** @param {String} value path of the base route */
    set basePath(arg: string);
    /** @returns {String} */
    get basePath(): string;
    _basePath: string;
    /** @param {String} value path of the route */
    set editPath(arg: string);
    /** @returns {String} */
    get editPath(): string;
    /** @param {String} value path of the route */
    set showPath(arg: string);
    /** @returns {String} */
    get showPath(): string;
    /** @param {String} value path of the route */
    set overviewPath(arg: string);
    /** @returns {String} */
    get overviewPath(): string;
    /** @param {String} value path of the route */
    set createPath(arg: string);
    /** @returns {String} */
    get createPath(): string;
    /** @param {ComponentOptions} value component of the base route */
    set baseComponent(
        arg: ComponentOptions<
            any,
            DefaultData<any>,
            DefaultMethods<any>,
            DefaultComputed,
            PropsDefinition<Record<string, any>>,
            Record<string, any>
        >
    );
    /** @returns {ComponentOptions} */
    get baseComponent(): ComponentOptions<
        any,
        DefaultData<any>,
        DefaultMethods<any>,
        DefaultComputed,
        PropsDefinition<Record<string, any>>,
        Record<string, any>
    >;
    _baseComponent: ComponentOptions<
        any,
        DefaultData<any>,
        DefaultMethods<any>,
        DefaultComputed,
        PropsDefinition<Record<string, any>>,
        Record<string, any>
    >;
    /** @param {ComponentOptions} value component of the route */
    set editComponent(
        arg: ComponentOptions<
            any,
            DefaultData<any>,
            DefaultMethods<any>,
            DefaultComputed,
            PropsDefinition<Record<string, any>>,
            Record<string, any>
        >
    );
    /** @returns {ComponentOptions} */
    get editComponent(): ComponentOptions<
        any,
        DefaultData<any>,
        DefaultMethods<any>,
        DefaultComputed,
        PropsDefinition<Record<string, any>>,
        Record<string, any>
    >;
    _editComponent: ComponentOptions<
        any,
        DefaultData<any>,
        DefaultMethods<any>,
        DefaultComputed,
        PropsDefinition<Record<string, any>>,
        Record<string, any>
    >;
    /** @param {ComponentOptions} value component of the route */
    set showComponent(
        arg: ComponentOptions<
            any,
            DefaultData<any>,
            DefaultMethods<any>,
            DefaultComputed,
            PropsDefinition<Record<string, any>>,
            Record<string, any>
        >
    );
    /** @returns {ComponentOptions} */
    get showComponent(): ComponentOptions<
        any,
        DefaultData<any>,
        DefaultMethods<any>,
        DefaultComputed,
        PropsDefinition<Record<string, any>>,
        Record<string, any>
    >;
    _showComponent: ComponentOptions<
        any,
        DefaultData<any>,
        DefaultMethods<any>,
        DefaultComputed,
        PropsDefinition<Record<string, any>>,
        Record<string, any>
    >;
    /** @param {ComponentOptions} value component of the route */
    set overviewComponent(
        arg: ComponentOptions<
            any,
            DefaultData<any>,
            DefaultMethods<any>,
            DefaultComputed,
            PropsDefinition<Record<string, any>>,
            Record<string, any>
        >
    );
    /** @returns {ComponentOptions} */
    get overviewComponent(): ComponentOptions<
        any,
        DefaultData<any>,
        DefaultMethods<any>,
        DefaultComputed,
        PropsDefinition<Record<string, any>>,
        Record<string, any>
    >;
    _overviewComponent: ComponentOptions<
        any,
        DefaultData<any>,
        DefaultMethods<any>,
        DefaultComputed,
        PropsDefinition<Record<string, any>>,
        Record<string, any>
    >;
    /** @param {ComponentOptions} value component of the route */
    set createComponent(
        arg: ComponentOptions<
            any,
            DefaultData<any>,
            DefaultMethods<any>,
            DefaultComputed,
            PropsDefinition<Record<string, any>>,
            Record<string, any>
        >
    );
    /** @returns {ComponentOptions} */
    get createComponent(): ComponentOptions<
        any,
        DefaultData<any>,
        DefaultMethods<any>,
        DefaultComputed,
        PropsDefinition<Record<string, any>>,
        Record<string, any>
    >;
    _createComponent: ComponentOptions<
        any,
        DefaultData<any>,
        DefaultMethods<any>,
        DefaultComputed,
        PropsDefinition<Record<string, any>>,
        Record<string, any>
    >;
    /** @param {String} value title of the route */
    set editTitle(arg: string);
    /** @returns {String} */
    get editTitle(): string;
    _showTitle: string;
    _editTitle: string;
    /** @param {String} value title of the route */
    set showTitle(arg: string);
    /** @returns {String} */
    get showTitle(): string;
    /** @param {String} value title of the route */
    set createTitle(arg: string);
    /** @returns {String} */
    get createTitle(): string;
    _createTitle: string;
    /** @param {String} value title of the route */
    set overviewTitle(arg: string);
    /** @returns {String} */
    get overviewTitle(): string;
    _overviewTitle: string;
    /**
     * create new instance of router settings with the base route name set
     *
     * @param {String} baseRouteName the name of the base route
     * @return {RouteSettings}
     */
    createNew(baseRouteName: string): RouteSettings;
}

export class RouteFactory {
    /**
     * Create the base for the routes based on the settings and add the children to it
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     * @param {RouteConfig[]} children
     *
     * @returns {RouteConfig}
     */
    createBase(settings: RouteSettings, children: RouteConfig[]): RouteConfig;
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
    createConfig(path: string, name: string, component: any, auth: boolean, admin: boolean, title: string): RouteConfig;
    /**
     * Create an overview route for the given settings
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     *
     * @returns {RouteConfig}
     */
    createOverview(settings: RouteSettings): RouteConfig;
    /**
     * Create a create route for the given settings
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     *
     * @returns {RouteConfig}
     */
    createCreate(settings: RouteSettings): RouteConfig;
    /**
     * Create a create route for the given settings
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     *
     * @returns {RouteConfig}
     */
    createShow(settings: RouteSettings): RouteConfig;
    /**
     * Create a create route for the given settings
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     *
     * @returns {RouteConfig}
     */
    createEdit(settings: RouteSettings): RouteConfig;
}
export class RouterService {
    /**
     *
     * @param {VueRouter} router the actual router
     * @param {RouteFactory} factory the router factory
     * @param {RouteSettings} settings the settings service for the routes
     */
    constructor(router: VueRouter, factory: RouteFactory, settings: RouteSettings);
    _router: VueRouter;
    _factory: RouteFactory;
    _settings: RouteSettings;
    _routerBeforeMiddleware: ((to: Route, from: Route, next: any) => boolean)[];
    _routerAfterMiddleware: any[];
    /**
     * register middleware for the router before entering the route
     * @param {Function} middlewareFunc the middleware function
     */
    registerBeforeMiddleware(middlewareFunc: Function): void;
    /**
     * register middleware for the router after entering a route
     * @param {Function} middlewareFunc the middleware function
     */
    registerAfterMiddleware(middlewareFunc: Function): void;
    /**
     * Add routes to the router
     * @param {RouteConfig[]} routes
     */
    addRoutes(routes: RouteConfig[]): void;
    /**
     * Go to the give route by name, optional id and query
     * If going to a route you are already on, it catches the given error
     *
     * @param {String} name the name of the new route
     * @param {String} [id] the optional id for the params of the new route
     * @param {Object.<string, string>} [query] the optional query for the new route
     */
    goToRoute(
        name: string,
        id?: string,
        query?: {
            [x: string]: string;
        }
    ): void;
    /**
     * create basic routes for the given settings
     *
     * @param {RouteSettings} settings the settings on which the routes are based
     */
    createRoutes(settings: RouteSettings): RouteConfig[];
    /**
     * Create new route settings
     *
     * @param {String} baseRouteName the base name for the routes being created
     *
     * @returns {RouteSettings}
     */
    newSettings(baseRouteName: string): RouteSettings;
    /**
     * @returns {(to:Route, from:Route, next:any) => Boolean}
     */
    get beforeMiddleware(): (to: Route, from: Route, next: any) => boolean;
}

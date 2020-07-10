import MinimalRouterView from '../components/MinimalRouterView';
import {storeService, routerService, pageCreatorService, eventService, translatorService} from '../services';

export class BaseController {
    /**
     * @param {String} APIEndpoint
     * @param {String} singular
     * @param {String} plural
     */
    constructor(APIEndpoint, singular, plural) {
        this._storeService = storeService;
        this._routerService = routerService;
        this._pageCreatorService = pageCreatorService;
        this._eventService = eventService;
        this._translatorService = translatorService;
        this._translatorService.setTranslation(APIEndpoint, {singular, plural})

        this._APIEndpoint = APIEndpoint;

        /**
         * Set the routes to go to after a certain action has been done by the store
         * Can be edited/overwritten in controller
         */
        this._goToPageAfterEditAction = this.goToShowPage;
        this._goToPageAfterCreateAction = this.goToOverviewPage;
        this._goToPageAfterDeleteAction = this.goToOverviewPage;

        /** Extra store functionality can added through the store service */
        this._extraStoreFunctionality = false;

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
        return () => this.getById(this._routerService._router.currentRoute.params.id);
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
        return () => this.destroy(this._routerService._router.currentRoute.params.id);
    }

    get read() {
        return () => this._storeService.read(this._APIEndpoint);
    }

    /** base pages */
    get basePage() {
        return {
            render: h => h(MinimalRouterView, {props: {depth: 1}}),
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
}

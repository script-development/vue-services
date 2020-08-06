/**
 * @typedef {import('../services/translator').Translation} Translation
 * @typedef {import('vuex').Module} Module
 * @typedef {import('vuex').ActionMethod} ActionMethod
 * @typedef {import('vuex').Mutation} MutationMethod
 *
 * @typedef {(State) => any} GetterMethod
 */

import MinimalRouterView from '../components/MinimalRouterView';
import {storeService, routerService, eventService, translatorService} from '../services';
import {pageCreator, tableCreator} from '../creators';

export class BaseController {
    /**
     * @param {String} APIEndpoint
     * @param {Translation} [translation]
     */
    constructor(APIEndpoint, translation) {
        this._storeService = storeService;
        this._routerService = routerService;
        this._eventService = eventService;
        this._translatorService = translatorService;
        // Creators
        this._pageCreatorService = pageCreator;
        this._tableCreator = tableCreator;

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
    get getAll() {
        return () => this._storeService.getAllFromStore(this._APIEndpoint);
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

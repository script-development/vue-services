/**
 * @typedef {import('../services/translator').Translation} Translation
 * @typedef {import('vuex').Module} Module
 * @typedef {import('vuex').ActionMethod} ActionMethod
 * @typedef {import('vuex').Mutation} MutationMethod
 *
 * @typedef {(State) => any} GetterMethod
 *
 * @typedef {Object<string,any>} Item
 */

import MinimalRouterView from '../components/MinimalRouterView';
import {storeService, routerService, eventService, translatorService} from '../services';

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
    }

    // prettier-ignore
    get APIEndpoint() {return this._APIEndpoint}

    /** go to the overview page from this controller */
    goToOverviewPage() {
        this._routerService.goToRoute(this.routeSettings.overviewName);
    }

    /**
     * go the the show page for the given item of the given id
     *
     * @param {String|Number} id id of item to go to the show page
     */
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

    /**
     * get all items from the store from this controller
     */
    get getAll() {
        return () => this._storeService.getAllFromStore(this._APIEndpoint);
    }

    /**
     * Get alle items from the given moduleName
     *
     * @param {String} moduleName moduleName to get all items from
     *
     * @returns {Item[]}
     */
    getAllFrom(moduleName) {
        return this._storeService.getAllFromStore(moduleName);
    }

    /**
     * Get an item from the store based on the given id
     * @param {String|Number} id get the item from the store base don id
     */
    getById(id) {
        return this._storeService.getByIdFromStore(this._APIEndpoint, id);
    }

    /**
     * Get an item based on the current route id
     */
    get getByCurrentRouteId() {
        return () => this.getById(this._routerService.id);
    }

    /**
     * Send an update to the api
     * @param {Item} item The item with the information to be updated
     * @param {String} [goToRouteName] the optional route to go to after the item has been succesfully updated
     */
    get update() {
        return (item, goToRouteName) =>
            this._storeService.update(this._APIEndpoint, item).then(() => {
                if (!goToRouteName) return this._goToPageAfterEditAction(item.id);
                this._routerService.goToRoute(goToRouteName);
            });
    }

    /**
     * Send a create to the api
     * @param {Item} item The item with the information to be created
     * @param {String} [goToRouteName] the optional route to go to after the item has been succesfully created
     */
    get create() {
        return (item, goToRouteName) =>
            this._storeService.create(this._APIEndpoint, item).then(() => {
                if (!goToRouteName) return this._goToPageAfterCreateAction(item.id);
                this._routerService.goToRoute(goToRouteName);
            });
    }

    /**
     * Send a delete to the api
     * @param {String|Number} id The id of the item to be deleted
     * @param {String} [goToRouteName] the optional route to go to after the item has been succesfully deleted
     */
    get destroy() {
        return (id, goToRouteName) =>
            this._storeService.destroy(this._APIEndpoint, id).then(() => {
                if (!goToRouteName) return this._goToPageAfterDeleteAction(id);
                this._routerService.goToRoute(goToRouteName);
            });
    }

    /**
     * Send a delete to the api without changing route afterwards
     *
     * @param {String|Number} id The id of the item to be deleted
     */
    get destroyByIdWithoutRouteChange() {
        return id => this._storeService.destroy(this._APIEndpoint, id);
    }

    /**
     * Send a delete with current route id to the api
     */
    get destroyByCurrentRouteId() {
        return () => this.destroy(this._routerService.id);
    }

    /**
     * Send a read request for the current controller
     * StoreService will catch the data and put it in store
     */
    get read() {
        return () => this._storeService.read(this._APIEndpoint);
    }

    /**
     * Send a read request for an item with id of the current route
     * StoreService will catch the data and put it in store
     */
    get showByCurrentRouteId() {
        return () => this.show(this._routerService.id);
    }

    /**
     * Send a read request for an item with the given id
     * StoreService will catch the data and put it in store
     *
     * @param {String|Number} id the id of the item to read from the server
     */
    get show() {
        return id => this._storeService.show(this._APIEndpoint, id);
    }

    /**
     * The base page for the current controller
     * Sned a read request to the server on mount
     */
    get basePage() {
        return {
            name: `${this.APIEndpoint}-base`,
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
         * Set basic pages, so there will be custom errors in the console when something is not implemented
         * Can be edited/overwritten in controller
         */
        this.routeSettings.baseComponent = this.basePage;
        this.routeSettings.editComponent = this.editPage;
        this.routeSettings.showComponent = this.showPage;
        this.routeSettings.overviewComponent = this.overviewPage;
        this.routeSettings.createComponent = this.createPage;

        /**
         * Create basic routes and add them to the global routes
         * Routes can only be: show, overview, edit and create
         */
        const routes = this._routerService.createRoutes(this.routeSettings);
        this._routerService.addRoutes(routes);
    }

    // prettier-ignore
    get routeSettings() { return this._routeSettings; }

    /** The standard message to show in the destroy modal */
    get destroyModalMessage() {
        return `Weet je zeker dat je deze ${this._translatorService.getSingular(this.APIEndpoint)} wil verwijderen?`;
    }

    /** Shows a modal with the standard destroy modal message. On OK will send a destroy request based on the current route id */
    get destroyByCurrentRouteIdModal() {
        return () => this._eventService.modal(this.destroyModalMessage, this.destroyByCurrentRouteId);
    }

    /**
     * Shows a modal with the standard destroy modal message. On OK will send a destroy request based on the given id
     * @param {String|Number} id
     */
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

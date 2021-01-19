import {StoreService} from './storeService';
import {RouterService, RouteSettings} from './routerService';
import {EventService, TranslatorService, Translation} from './services';
import {Module, ActionMethod, MutationMethod} from 'vuex';
import {AxiosRequestConfig} from 'axios';
import {Component} from 'vue';

type GetterMethod = (state: any) => any;
export type Item = {[key: string]: any};

export class BaseController {
    /**
     * @param {String} APIEndpoint
     * @param {Translation} [translation]
     */
    constructor(APIEndpoint: string, translation?: Translation);
    _storeService: StoreService;
    _routerService: RouterService;
    _eventService: EventService;
    _translatorService: TranslatorService;
    _APIEndpoint: string;
    /**
     * Set the routes to go to after a certain action has been done by the store
     * Can be edited/overwritten in controller
     */
    _goToPageAfterEditAction: (id: any) => void;
    _goToPageAfterCreateAction: () => void;
    _goToPageAfterDeleteAction: () => void;
    /** Extra store functionality can added through the store service */
    _extraStoreFunctionality: Module<string, any>;
    /**
     * Initiate basic route settings
     * Settings can be changed in controller
     */
    _routeSettings: RouteSettings;
    get APIEndpoint(): string;
    /** go to the overview page from this controller */
    goToOverviewPage(): void;
    /**
     * go the the show page for the given item of the given id
     *
     * @param {String|Number} id id of item to go to the show page
     */
    goToShowPage(id: string | number): void;
    /**
     * Go to the edit page for this controller
     * @param {String|Number} id
     * @param {Object.<string, string>} [query] the optional query for the new route
     */
    goToEditPage(
        id: string | number,
        query?: {
            [x: string]: string;
        }
    ): void;
    /**
     * Go to the create page for this controller
     *
     * @param {Object.<string, string>} [query] the optional query for the new route
     */
    goToCreatePage(query?: {[x: string]: string}): void;
    /** get all items from the store from this controller */
    getAll(): any;
    /**
     * Get alle items from the given moduleName
     * If moduleName is not found throws a StoreModuleNotFoundError
     *
     * @param {String} moduleName moduleName to get all items from
     *
     * @returns {Item[]}
     * @throws {StoreModuleNotFoundError}
     */
    getAllFrom(moduleName: string): Item[];

    /**
     * Get an item from the store based on the given id
     * @param {String|Number} id get the item from the store base don id
     */
    getById(id: number): Item;
    /**
     * Get an item based on the current route id
     */
    get getByCurrentRouteId(): () => Item;
    /**
     * Send an update to the api
     * @param {Item} item The item with the information to be updated
     * @param {String} [goToRouteName] the optional route to go to after the item has been succesfully updated
     */
    get update(): (item: Item, goToRouteName: string) => Promise<void>;
    /**
     * Send a create to the api
     * @param {Item} item The item with the information to be created
     * @param {String} [goToRouteName] the optional route to go to after the item has been succesfully created
     */
    get create(): (item: Item, goToRouteName: string) => Promise<void>;
    /**
     * Send a delete to the api
     * @param {String|Number} id The id of the item to be deleted
     * @param {String} [goToRouteName] the optional route to go to after the item has been succesfully deleted
     */
    get destroy(): (id: string | number, goToRouteName: string) => Promise<void>;
    /**
     * Send a delete to the api without changing route afterwards
     *
     * @param {String|Number} id The id of the item to be deleted
     */
    get destroyByIdWithoutRouteChange(): (id: string | number) => Promise<any>;
    /**
     * Send a delete with current route id to the api
     */
    get destroyByCurrentRouteId(): () => Promise<void>;
    /**
     * Send a read request for the current controller
     * StoreService will catch the data and put it in store
     */
    get read(): () => Promise<any>;
    /**
     * Send a read request for an item with id of the current route
     * StoreService will catch the data and put it in store
     */
    get showByCurrentRouteId(): () => Promise<any>;
    /**
     * Send a read request for an item with the given id
     * StoreService will catch the data and put it in store
     *
     * @param {String|Number} id the id of the item to read from the server
     */
    get show(): (id: string | number) => Promise<any>;
    /**
     * The base page for the current controller
     * Sned a read request to the server on mount
     */
    get basePage(): Component;

    get overviewPage(): Component | boolean;
    get createPage(): Component | boolean;
    get showPage(): Component | boolean;
    get editPage(): Component | boolean;
    /**
     * init the controller
     * this will add a module to the store and register routes
     */
    init(): void;
    get routeSettings(): RouteSettings;
    /** The standard message to show in the destroy modal */
    get destroyModalMessage(): string;
    /** Shows a modal with the standard destroy modal message. On OK will send a destroy request based on the current route id */
    get destroyByCurrentRouteIdModal(): () => void;
    /**
     * Shows a modal with the standard destroy modal message. On OK will send a destroy request based on the given id
     * @param {String|Number} id
     */
    get destroyByIdModal(): (id: any) => void;

    /**
     * Add an extra action to this store module
     */
    setExtraStoreAction(name: string, action: ActionMethod): void;

    /**
     * Add an extra mutation to this store module
     */
    setExtraStoreMutation(name: string, mutation: MutationMethod): void;

    /**
     * Add an extra getter to this store module
     */
    setExtraStoreGetter(name: string, getter: GetterMethod): void;
    /**
     * create a new action to add to the store which sends a get request
     * url for the new request will be: this.APIEndpoint + payload ? `/${payload}` : ''
     *
     * @param {String} name name of the new action
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    createAndSetExtraGetAction(name: string, options: AxiosRequestConfig): void;

    /**
     * create a new action to add to the store which sends a post request
     * url for the post request will be: `${this.APIEndpoint}/${payload.id}/${name}
     *
     * @param {String} name name of the new action and the last part of the url
     */
    createAndSetExtraPostAction(name: string): void;
    /**
     * dispatch an action to the store
     * @param {String} action the name of the action being dispatched
     * @param {*} payload the payload being used by the action
     */
    dispatchToStore(action: string, payload: any): void;

    /**
     * pops up a modal with the given message
     * @param {String} message the message being shown by the modal
     * @param {Function} okAction the function being used when click on ok
     * @param {Function} [cancelAction] the being used when click on cancel
     */
    popModal(message: string, okAction: Function, cancelAction?: Function): void;
}

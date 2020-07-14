import {StoreService} from './storeService';
import {RouterService, RouteSettings} from './routerService';
import {PageCreatorService, EventService, TranslatorService, Translation} from './services';
import {Module, ActionMethod, MutationMethod} from 'vuex';
import {AxiosRequestConfig} from 'axios';

type GetterMethod = (state: any) => any;

export class BaseController {
    /**
     * @param {String} APIEndpoint
     * @param {Translation} [translation]
     */
    constructor(APIEndpoint: string, translation?: Translation);
    _storeService: StoreService;
    _routerService: RouterService;
    _pageCreatorService: PageCreatorService;
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
    /** go to pages functions */
    goToOverviewPage(): void;
    goToShowPage(id: any): void;
    /**
     * Go to the edit page for this controller
     * @param {String} id
     * @param {Object.<string, string>} [query] the optional query for the new route
     */
    goToEditPage(
        id: string,
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
    /** store service getter functions */
    getAll(): any;
    getById(id: any): any;
    get getByCurrentRouteId(): () => any;
    /** store service action functions */
    get update(): (item: any, goToRouteName: any) => Promise<void>;
    get create(): (item: any, goToRouteName: any) => Promise<void>;
    get destroy(): (id: any, goToRouteName: any) => Promise<void>;
    get destroyByIdWithoutRouteChange(): (id: any) => Promise<any>;
    get destroyByCurrentRouteId(): () => Promise<void>;
    get read(): () => Promise<any>;
    get showByCurrentRouteId(): () => Promise<any>;
    /** base pages */
    get basePage(): {
        render: (h: any) => any;
        mounted: () => Promise<any>;
    };
    get overviewPage(): void;
    get createPage(): void;
    get showPage(): void;
    get editPage(): void;
    /**
     * init the controller
     * this will add a module to the store and register routes
     */
    init(): void;
    get routeSettings(): RouteSettings;
    get destroyModalMessage(): string;
    get destroyByCurrentRouteIdModal(): () => void;
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

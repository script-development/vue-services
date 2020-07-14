import {StoreService} from './storeService';
import {RouterService, RouteSettings} from './routerService';
import {PageCreatorService, EventService, TranslatorService, Translation} from './services';

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
    _extraStoreFunctionality: boolean;
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
}

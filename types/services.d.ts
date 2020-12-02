import {Vue} from 'vue/types/vue';
import {StoreService} from './storeService';

import {Item} from './controllers';

type Credentials = {email: string; password: string; rememberMe: boolean};
type RepeatPasswordData = {password: string; repeatPassword: string; [key: string]: string};

export class EventService {
    /**
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(httpService: HTTPService);
    _httpService: HTTPService;
    _app: Vue;

    set app(app: Vue);
    get app(): Vue;

    get responseMiddleware(): ResponseMiddleware;
    get responseErrorMiddleware(): ResponseErrorMiddleware;
    /**
     * pops up a toast with given message in the given variance
     * @param {String} message the message being shown by the toast
     * @param {String} variant the toast variant
     */
    toast(message: string, variant: string): void;
    /**
     * pops up a success toast
     * @param {String} message the message being shown by the toast
     */
    successToast(message: string): void;
    /**
     * pops up a danger toast
     * @param {String} message the message being shown by the toast
     */
    dangerToast(message: string): void;
    /**
     * pops up a modal with the given message
     * @param {String} message the message being shown by the modal
     * @param {Function} okAction the function being used when click on ok
     * @param {Function} [cancelAction] the being used when click on cancel
     */
    modal(message: string, okAction: Function, cancelAction?: Function): void;
}

export const MSG_PACK_DATA_TYPE = 'msg-pack';

type StaticDataTypes = [string | {[moduleName: string]: typeof MSG_PACK_DATA_TYPE}];

export class StaticDataService {
    /**
     * @param {StoreService} storeService
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(storeService: StoreService, httpService: HTTPService);
    _storeService: StoreService;
    _httpService: HTTPService;
    _data: {normal: string[]; msgpack: string[]};

    /**
     * initiates the setup for the default store modules
     *
     * @param {[string,Object<string,string>]} data Modulenames
     */
    createStoreModules(data: StaticDataTypes): void;

    /**
     * Creates and registers modules for the staticdata
     *
     * @param {string} storeModuleName Modulenames
     */
    createStoreModule(storeModuleName: string): void;

    /**
     * Create module for static data with msg-pack lite(peerDependencies)
     *
     * @param {string} storeModuleName Modulenames
     */
    createStoreModuleMsgPack(storeModuleName: string): void;

    /**
     * Sends an action to the store which reads all the staticdata from the server
     */
    getStaticData(): void;

    /**
     * Retrieves all entries from the specific data source
     *
     * @param {string} data
     */
    getAll(data: string): Item[];

    /**
     * Retrieves a single row(by ID) from the specific data source
     *
     * @param {String} data
     * @param {Number} id
     */
    getById(data: string, id: number): Item;
}

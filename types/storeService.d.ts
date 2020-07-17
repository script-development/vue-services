import {AxiosResponse, AxiosRequestConfig} from 'axios';
import {HTTPService, StorageService} from './services';
import {Store, Module} from 'vuex';

export class StoreModuleFactory {
    /**
     * @param {HTTPService} httpService
     * @param {StorageService} storageService the storage service for storing stuff in the browser
     * @param {Boolean} namespaced
     */
    constructor(httpService: HTTPService, storageService: StorageService, namespaced?: boolean);
    _httpService: HTTPService;
    _storageService: StorageService;
    _namespaced: boolean;
    /** @type {String} */ _readAllGetter: string;
    /** @type {String} */ _readByIdGetter: string;
    /** @type {String} */ _allItemsStateName: string;
    /** @type {String} */ _setAllMutation: string;
    /** @type {String} */ _deleteMutation: string;
    /** @type {String} */ _readAction: string;
    /** @type {String} */ _updateAction: string;
    /** @type {String} */ _createAction: string;
    /** @type {String} */ _deleteAction: string;
    /** @type {String} */ _setAllAction: string;
    /**
     * Generate a default store module
     * @param {String} moduleName the name of the module
     * @param {String} [endpoint] the optional endpoint for the API
     */
    createDefaultStore(
        moduleName: string,
        endpoint?: string
    ): {
        namespaced: boolean;
        state: {
            [x: string]: {};
        };
        getters: {
            [x: string]: ((state: any) => any[]) | ((state: any) => (id: any) => any);
        };
        mutations: {
            [x: string]: (state: any, allData: any) => any;
        };
        actions: {
            [x: string]: (
                {
                    commit,
                }: {
                    commit: any;
                },
                allData: any
            ) => any;
        };
    };
    /** create default state for the store */
    createDefaultState(
        moduleName: string
    ): {
        [x: string]: {};
    };
    /** create default getters for the store */
    createDefaultGetters(): {
        [x: string]: ((state: any) => any[]) | ((state: any) => (id: any) => any);
    };
    /** create default mutations for the store */
    createDefaultMutations(
        moduleName: string
    ): {
        [x: string]: (state: any, allData: any) => any;
    };
    /**
     * create default actions for the store
     * if the endpoint is given it also generates actions for the endpoint
     *
     * @param {String} [endpoint] optional endpoint for the API
     * */
    createDefaultActions(
        endpoint?: string
    ): {
        [x: string]: (
            {
                commit,
            }: {
                commit: any;
            },
            allData: any
        ) => any;
    };
    /**
     * create a new action to add to the store which sends a post request
     *
     * @param {String} endpoint api endpoint
     * @param {String} actionName the last part of the url
     */
    createExtraPostAction(
        endpoint: string,
        actionName: string
    ): {
        [x: string]: (_: any, payload: any) => Promise<AxiosResponse<any>>;
    };
    /**
     * create a new action to add to the store which sends a get request
     *
     * @param {String} endpoint api endpoint
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    createExtraGetAction(
        endpoint: string,
        options?: AxiosRequestConfig
    ): {
        [x: string]: (_: any, payload: any) => Promise<AxiosResponse<any>>;
    };
    set readAllGetter(arg: string);
    get readAllGetter(): string;
    set readByIdGetter(arg: string);
    get readByIdGetter(): string;
    set allItemsStateName(arg: string);
    get allItemsStateName(): string;
    set setAllMutation(arg: string);
    get setAllMutation(): string;
    set deleteMutation(arg: string);
    get deleteMutation(): string;
    set readAction(arg: string);
    get readAction(): string;
    set updateAction(arg: string);
    get updateAction(): string;
    set createAction(arg: string);
    get createAction(): string;
    set deleteAction(arg: string);
    get deleteAction(): string;
    set setAllAction(arg: string);
    get setAllAction(): string;
}
export class StoreService {
    /**
     *
     * @param {Store} store the store being used
     * @param {StoreModuleFactory} factory the factory being used to create store modules
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(store: import('vuex').Store<any>, factory: StoreModuleFactory, httpService: HTTPService);
    _store: Store<any>;
    _factory: StoreModuleFactory;
    _httpService: HTTPService;
    _moduleNames: any[];
    get responseMiddleware(): ({data}: {data: any}) => void;
    /**
     * get something from the store
     *
     * @param {String} moduleName the name of the module to get something from
     * @param {String} getter the name of the getter
     */
    get(moduleName: string, getter: string): any;
    /**
     * dispatch an action to the store
     *
     * @param {String} moduleName the name of the module to dispatch the action to
     * @param {String} action the name of the action
     * @param {*} payload the payload to sent to the action
     */
    dispatch(moduleName: string, action: string, payload: any): Promise<any>;
    /**
     * Get all from data from the given store module
     *
     * @param {String} storeModule the module from which to get all
     */
    getAllFromStore(storeModule: string): any;
    /**
     * Get all data from the given store module by id
     *
     * @param {String} storeModule the module from which to get all
     * @param {String} id the id of the data object to get
     */
    getByIdFromStore(storeModule: string, id: string): any;
    /**
     * dispatch an action to the store, which deletes an item on the server
     *
     * @param {String} storeModule the store module for which an item must be deleted
     * @param {String} id the id of the item to be deleted
     */
    destroy(storeModule: string, id: string): Promise<any>;
    /**
     * dispatch an action to the store, which updates an item on the server
     *
     * @param {String} storeModule the store module for which an item must be updated
     * @param {Object} item the item to be updated
     */
    update(storeModule: string, item: any): Promise<any>;
    /**
     * dispatch an action to the store, which creates an item on the server
     *
     * @param {String} storeModule the store module for which an item must be created
     * @param {Object} item the item to be created
     */
    create(storeModule: string, item: any): Promise<any>;
    /**
     * dispatch an action to the store, which reads all items on the server
     *
     * @param {String} storeModule the store module for which all items must be read
     */
    read(storeModule: string): Promise<any>;
    /**
     * dispatch an action to the store, which reads an item on the server
     *
     * @param {String} storeModule the store module for which the item must be read
     * @param {Number} id the id to be read
     */
    show(storeModule: string, id: number): Promise<any>;
    /**
     * Set all the data in the store module
     *
     * @param {String} storeModule the module to fill the data with
     * @param {*} data data to fill the store with
     */
    setAllInStore(storeModule: string, data: any): Promise<any>;
    /**
     *  get the read all from store getter with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getReadAllGetter(seperator?: boolean): string;
    /**
     *  get the read by id from store getter with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getReadByIdGetter(seperator?: boolean): string;
    /**
     *  get the read store action with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getReadAction(seperator?: boolean): string;
    /**
     *  get the delete store action with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getDeleteAction(seperator?: boolean): string;
    /**
     *  get the update store action with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getUpdateAction(seperator?: boolean): string;
    /**
     *  get the update store action with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getCreateAction(seperator?: boolean): string;
    /**
     *  get the set all in store action with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getSetAllInStoreAction(seperator?: boolean): string;
    /**
     *  get the all data in store state name with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getAllItemsStateName(seperator?: boolean): string;
    /**
     *  get the set all mutation name with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getSetAllMutation(seperator?: boolean): string;
    /**
     *  get the delete mutation name with or without seperator
     * @param {Boolean} [seperator] with or without seperator, default true
     */
    getDeleteMutation(seperator?: boolean): string;
    /** get the store seperator */
    get storeSeperator(): string;
    /** Set the factory name */
    setFactorySettings(): void;
    /**
     * generate and set the default store module in the store
     *
     * @param {String} moduleName the name of the module
     * @param {String} [endpoint] the endpoint for the API
     * @param {Module} [extraFunctionality] extra functionality added to the store
     */
    generateAndSetDefaultStoreModule(
        moduleName: string,
        endpoint?: string,
        extraFunctionality?: Module<string, any>
    ): void;
    /**
     * set the store module in the store
     *
     * @param {String} moduleName the name of the module
     * @param {Module} storeModule the module to add to the store
     */
    registerModule(moduleName: string, storeModule: Module<string, any>): void;
    /**
     * create a new action to add to the store which sends a post request
     *
     * @param {String} endpoint api endpoint
     * @param {String} actionName the last part of the url
     */
    createExtraPostAction(
        endpoint: string,
        actionName: string
    ): {
        [x: string]: (_: any, payload: any) => Promise<AxiosResponse<any>>;
    };
    /**
     * create a new action to add to the store which sends a get request
     *
     * @param {String} endpoint api endpoint
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    createExtraGetAction(
        endpoint: string,
        options?: AxiosRequestConfig
    ): {
        [x: string]: (_: any, payload: any) => Promise<AxiosResponse<any>>;
    };
}

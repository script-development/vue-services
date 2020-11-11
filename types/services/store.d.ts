import {AxiosResponse} from 'axios';
import {ComputedRef} from 'vue';
import {ExtraStoreFunctionality, Item} from '../types';

export type StoreModule = {
    /** Get all items from the store */
    all: ComputedRef<Item[]>;
    /** Get an item from the state by id */
    byId(id: string): Item;
    /**
     * Set data in the state.
     * Data can be of any kind.
     */
    setAll(data: Item | Item[]): void;
};
export type Store = {[moduleName: string]: StoreModule};

/**
 * Creates a store module for the given module name.
 * When extra store functionality is given, it will extend the base module with the extra functionality.
 *
 * @param {string} moduleName the name of the module, also the endpoint for the module
 * @param {ExtraStoreFunctionality} [extraFunctionality] the optional extra functionality to add to the store
 */
export function StoreModuleFactory(moduleName: string, extraFunctionality?: ExtraStoreFunctionality): StoreModule;

/**
 * generic function to call functions inside the store
 *
 * @param {String} moduleName the name of the module to dispatch the action to
 * @param {String} functionName the name of the function
 * @param {*} [payload] the payload to sent to the action
 */
export function performStoreAction(moduleName: string, functionName: string, payload?: any): any;

/**
 * dispatch an action to the store
 *
 * @param {String} moduleName the name of the module to dispatch the action to
 * @param {String} action the name of the action
 * @param {*} [payload] the payload to sent to the action
 */
export function dispatchActionToStore(moduleName: string, action: string, payload?: any): any;

/**
 * Get all from data from the given store module
 *
 * @param {String} moduleName the module from which to get all
 */
export function getAllFromStore(moduleName: string): ComputedRef<Item[]>;

/**
 * Get all data from the given store module by id
 *
 * @param {String} moduleName the module from which to get all
 * @param {String} id the id of the data object to get
 *
 * @return {Item}
 */
export function getByIdFromStore(moduleName: string, id: string): Item;

/**
 * Sends a delete request to the server.
 * Delete's the given id from the server
 *
 * @param {String} moduleName the store module for which an item must be updated
 * @param {number} id the id to delete from the server
 */
export function destroyStoreAction(moduleName: string, id: number): Promise<AxiosResponse<any>>;

/**
 * Sends a post request to the server, which updates the given item on the server
 *
 * @param {String} moduleName the store module for which an item must be updated
 * @param {Item} item the item to be updated
 */
export function updateStoreAction(moduleName: string, item: Item): Promise<AxiosResponse<any>>;

/**
 * Sends a post request to the server, which creates the item on the server
 *
 * @param {String} moduleName the store module for which an item must be created
 * @param {Item} item the item to be created
 */
export function createStoreAction(moduleName: string, item: Item): Promise<AxiosResponse<any>>;
/**
 * Sends a get request to the server, which returns all items on the server from that endpoint
 *
 * @param {String} moduleName the store module for which all items must be read
 */
export function readStoreActionmoduleName(): Promise<AxiosResponse<any>>;

/**
 * Sends a get request to the server, which returns a single item on the server based on the given id
 *
 * @param {String} moduleName the store module for which the item must be read
 * @param {Number} id the id to be read
 */
export function showStoreAction(moduleName: string, id: number): Promise<AxiosResponse<any>>;

/**
 * set the store module in the store
 *
 * @param {String} moduleName the name of the module
 * @param {StoreModule} storeModule the module to add to the store
 */
export function registerStoreModule(moduleName: string, storeModule: StoreModule): void;

/**
 * generate and set the default store module in the store
 *
 * @param {String} moduleName the name of the module
 * @param {ExtraStoreFunctionality} [extraFunctionality] extra functionality added to the store
 */
export function generateAndRegisterDefaultStoreModule(
    moduleName: string,
    extraFunctionality: ExtraStoreFunctionality
): void;

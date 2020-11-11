/**
 * @typedef {import('../../../types/types').Item} Item
 * @typedef {import('../../../types/types').ExtraStoreFunctionality} ExtraStoreFunctionality
 * @typedef {import('../../../types/types').ResponseMiddleware} ResponseMiddleware
 *
 * @typedef {Object<string,BaseStoreModule>} Store
 */
import {StoreModuleNotFoundError} from '../../errors/StoreModuleNotFoundError';
import {registerResponseMiddleware} from '../http';
import StoreModuleFactory from './factory';

/** @type {Store} */
const store = {};

/** @type {String[]} */
const moduleNames = [];

/**
 * Checks if requested module exists in the store
 * If not, throws a StoreModuleNotFoundError
 *
 * @param {String} moduleName the name to check if exists
 *
 * @throws {StoreModuleNotFoundError} when the given moduleName does not exist
 */
const checkIfRequestedModuleExists = moduleName => {
    if (moduleNames.indexOf(moduleName) !== -1) return;

    throw new StoreModuleNotFoundError(
        `Could not find ${moduleName}, only these modules exists at the moment: ${moduleNames.toString()}`
    );
};

// TODO :: will need to export for testing?
/**
 * The store service response middleware checks if any of the known modulenames is in the data of the response
 * When there is a modulename in the response it dispatches an action to that module to set the response data in the store
 * @type {ResponseMiddleware}
 */
const responseMiddleware = ({data}) => {
    if (!data) return;
    for (const storeModuleName of moduleNames) {
        if (!data[storeModuleName]) continue;

        store[storeModuleName].setAll(data[storeModuleName]);
    }
};

registerResponseMiddleware(responseMiddleware);

/**
 * generic function to call functions inside the store
 *
 * @param {String} moduleName the name of the module to dispatch the action to
 * @param {String} functionName the name of the function
 * @param {*} [payload] the payload to sent to the action
 */
const doStoreStuff = (moduleName, functionName, payload) => {
    checkIfRequestedModuleExists(moduleName);
    return store[moduleName][functionName](payload);
};

/**
 * get something from the store
 *
 * @param {String} moduleName the name of the module to get something from
 * @param {String} getter the name of the getter
 */
export const getFromStore = (moduleName, getter) => {
    checkIfRequestedModuleExists(moduleName);
    return store[moduleName][getter];
};

/**
 * dispatch an action to the store
 *
 * @param {String} moduleName the name of the module to dispatch the action to
 * @param {String} action the name of the action
 * @param {*} [payload] the payload to sent to the action
 */
export const dispatchActionToStore = (moduleName, action, payload) => doStoreStuff(moduleName, action, payload);

/**
 * Get all from data from the given store module
 *
 * @param {String} moduleName the module from which to get all
 *
 * @returns {Item[]}
 */
export const getAllFromStore = moduleName => getFromStore(moduleName, 'all');

/**
 * Get all data from the given store module by id
 *
 * @param {String} moduleName the module from which to get all
 * @param {String} id the id of the data object to get
 *
 * @return {Item}
 */
export const getByIdFromStore = (moduleName, id) => doStoreStuff(moduleName, 'byId', id);

/**
 * dispatch an action to the store, which deletes an item on the server
 *
 * @param {String} moduleName the store module for which an item must be deleted
 * @param {String} id the id of the item to be deleted
 */
export const destroyFromStore = (moduleName, id) => {
    // TODO :: the following bellow should be enough
    // dispatchActionToStore(moduleName, 'delete', id)
    checkIfRequestedModuleExists(moduleName);
    return store[moduleName].delete(id).then(response => {
        // TODO :: check if this is really needed
        store[moduleName].deleteEntryById(id);
        return response;
    });
};

/**
 * dispatch an action to the store, which updates an item on the server
 *
 * @param {String} moduleName the store module for which an item must be updated
 * @param {Item} item the item to be updated
 */
export const updateStoreAction = (moduleName, item) => dispatchActionToStore(moduleName, 'post', item);

/**
 * dispatch an action to the store, which creates an item on the server
 *
 * @param {String} moduleName the store module for which an item must be created
 * @param {Item} item the item to be created
 */
export const createStoreAction = (moduleName, item) => dispatchActionToStore(moduleName, 'post', item);
/**
 * dispatch an action to the store, which reads all items on the server
 *
 * @param {String} moduleName the store module for which all items must be read
 */
export const readStoreAction = moduleName => dispatchActionToStore(moduleName, 'get');

/**
 * dispatch an action to the store, which reads an item on the server
 *
 * @param {String} moduleName the store module for which the item must be read
 * @param {Number} id the id to be read
 */
export const showStoreAction = (moduleName, id) => dispatchActionToStore(moduleName, 'get', id);

/**
 * set the store module in the store
 *
 * @param {String} moduleName the name of the module
 * @param {BaseStoreModule} storeModule the module to add to the store
 */
export const registerModule = (moduleName, storeModule) => {
    moduleNames.push(moduleName);
    store[moduleName] = storeModule;
};

/**
 * generate and set the default store module in the store
 *
 * @param {String} moduleName the name of the module
 * @param {ExtraStoreFunctionality} [extraFunctionality] extra functionality added to the store
 */
export const generateAndRegisterDefaultStoreModule = (moduleName, extraFunctionality) =>
    registerModule(moduleName, StoreModuleFactory(moduleName, extraFunctionality));

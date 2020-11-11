/**
 * @typedef {import('../../../types/types').Item} Item
 * @typedef {import('../../../types/types').ResponseMiddleware} ResponseMiddleware
 * @typedef {import('../../../types/services/store').StoreModule} StoreModule
 * @typedef {import('../../../types/services/store').Store} Store
 */
import {StoreModuleNotFoundError} from '../../errors/StoreModuleNotFoundError';
import {registerResponseMiddleware} from '../http';
import StoreModuleFactory from './factory';

// TODO :: can only get functions from the store module at this moment
// could add properties

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
const performStoreAction = (moduleName, functionName, payload) => {
    checkIfRequestedModuleExists(moduleName);
    return store[moduleName][functionName](payload);
};

/**
 * dispatch an action to the store
 *
 * @param {String} moduleName the name of the module to dispatch the action to
 * @param {String} action the name of the action
 * @param {*} [payload] the payload to sent to the action
 */
export const dispatchActionToStore = (moduleName, action, payload) => performStoreAction(moduleName, action, payload);

/**
 * Get all from data from the given store module
 *
 * @param {String} moduleName the module from which to get all
 *
 * @returns {import('vue').ComputedRef<Item[]>}
 */
export const getAllFromStore = moduleName => {
    // TODO :: check if this is always called when the computed changes
    checkIfRequestedModuleExists(moduleName);
    return store[moduleName].all;
};

/**
 * Get all data from the given store module by id
 *
 * @param {String} moduleName the module from which to get all
 * @param {String} id the id of the data object to get
 *
 * @return {Item}
 */
export const getByIdFromStore = (moduleName, id) => performStoreAction(moduleName, 'byId', id);

/**
 * set the store module in the store
 *
 * @param {String} moduleName the name of the module
 * @param {StoreModule} storeModule the module to add to the store
 */
export const registerStoreModule = (moduleName, storeModule) => {
    moduleNames.push(moduleName);
    store[moduleName] = storeModule;
};

/**
 * generate and set the default store module in the store
 *
 * @param {String} moduleName the name of the module
 */
export const generateAndRegisterDefaultStoreModule = moduleName =>
    registerStoreModule(moduleName, StoreModuleFactory(moduleName));

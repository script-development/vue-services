/**
 * @typedef {import('./factory').StoreModuleFactory} StoreModuleFactory
 * @typedef {import('../http').HTTPService} HTTPService
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 *
 * @typedef {import('../../errors/StoreModuleNotFoundError').StoreModuleNotFoundError} StoreModuleNotFoundError
 * @typedef {import('../../controllers').Item} Item
 * @typedef {import('./factory/module').BaseStoreModule} BaseStoreModule
 *
 * @typedef {Object<string,BaseStoreModule>} Store
 */

import {StoreModuleNotFoundError} from '../../errors/StoreModuleNotFoundError';

export class StoreService {
    /**
     * @param {StoreModuleFactory} factory the factory being used to create store modules
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(factory, httpService) {
        /** @type {Store} */
        this._store = {};
        this._factory = factory;
        this._httpService = httpService;

        /** @type {String[]} */
        this._moduleNames = [];

        this._httpService.registerResponseMiddleware(this.responseMiddleware);
    }

    /**
     * The store service response middleware checks if any of the known modulenames is in the data of the response
     * When there is a modulename in the response it dispatches an action to that module to set the response data in the store
     */
    get responseMiddleware() {
        return ({data}) => {
            if (!data) return;
            for (const storeModuleName of this._moduleNames) {
                if (data[storeModuleName]) {
                    this.setAllInStore(storeModuleName, data[storeModuleName]);
                }
            }
        };
    }

    /**
     * get something from the store
     *
     * @param {String} moduleName the name of the module to get something from
     * @param {String} getter the name of the getter
     */
    get(moduleName, getter) {
        this.checkIfRequestedModuleExists(moduleName);
        // TODO :: check if this works
        return this._store[moduleName][getter];
    }

    /**
     * dispatch an action to the store
     *
     * @param {String} moduleName the name of the module to dispatch the action to
     * @param {String} action the name of the action
     * @param {*} payload the payload to sent to the action
     */
    dispatch(moduleName, action, payload) {
        return this._store[moduleName][action](payload);
    }

    /**
     * Get all from data from the given store module
     *
     * @param {String} moduleName the module from which to get all
     *
     * @returns {Item[]}
     */
    getAllFromStore(moduleName) {
        this.checkIfRequestedModuleExists(moduleName);
        return this._store[moduleName].all;
    }

    /**
     * Get all data from the given store module by id
     *
     * @param {String} moduleName the module from which to get all
     * @param {String} id the id of the data object to get
     *
     * @return {Item}
     */
    getByIdFromStore(moduleName, id) {
        this.checkIfRequestedModuleExists(moduleName);
        return this._store[moduleName].byId(id);
    }

    /**
     * dispatch an action to the store, which deletes an item on the server
     *
     * @param {String} moduleName the store module for which an item must be deleted
     * @param {String} id the id of the item to be deleted
     */
    destroy(moduleName, id) {
        return this._store[moduleName].delete(id).then(response => {
            this._store[moduleName].deleteEntryById(id);
            return response;
        });
    }

    /**
     * dispatch an action to the store, which updates an item on the server
     *
     * @param {String} moduleName the store module for which an item must be updated
     * @param {Item} item the item to be updated
     */
    update(moduleName, item) {
        return this._store[moduleName].post(item);
    }

    /**
     * dispatch an action to the store, which creates an item on the server
     *
     * @param {String} moduleName the store module for which an item must be created
     * @param {Item} item the item to be created
     */
    create(moduleName, item) {
        return this._store[moduleName].post(item);
    }

    /**
     * dispatch an action to the store, which reads all items on the server
     *
     * @param {String} moduleName the store module for which all items must be read
     */
    read(moduleName) {
        return this._store[moduleName].get();
    }

    /**
     * dispatch an action to the store, which reads an item on the server
     *
     * @param {String} moduleName the store module for which the item must be read
     * @param {Number} id the id to be read
     */
    show(moduleName, id) {
        return this._store[moduleName].get(id);
    }

    /**
     * Set all the data in the store module
     *
     * @param {String} moduleName the module to fill the data with
     * @param {Item | Item[]} data data to fill the store with
     */
    setAllInStore(moduleName, data) {
        return this._store[moduleName].setAll(data);
    }

    /**
     * generate and set the default store module in the store
     *
     * @param {String} moduleName the name of the module
     * @param {String} [endpoint] the endpoint for the API
     * @param {Object<string,Function>} [extraFunctionality] extra functionality added to the store
     */
    generateAndSetDefaultStoreModule(moduleName, endpoint, extraFunctionality) {
        // TODO :: mixin for etraFunctionality?
        const storeModule = this._factory.createDefaultStore(endpoint);

        if (extraFunctionality) {
            for (const name in extraFunctionality) {
                storeModule[name] = extraFunctionality[name];
            }
        }

        this.registerModule(moduleName, storeModule);
    }

    /**
     * set the store module in the store
     *
     * @param {String} moduleName the name of the module
     * @param {Module} storeModule the module to add to the store
     */
    registerModule(moduleName, storeModule) {
        this._moduleNames.push(moduleName);
        this._store[moduleName] = storeModule;
    }

    /**
     * Checks if requested module exists in the store
     * If not, throws a StoreModuleNotFoundError
     *
     * @param {String} moduleName
     *
     * @throws {StoreModuleNotFoundError}
     */
    checkIfRequestedModuleExists(moduleName) {
        if (this._moduleNames.indexOf(moduleName) !== -1) return;

        throw new StoreModuleNotFoundError(
            `Could not find ${moduleName}, only these modules exists at the moment: ${this._storeService._moduleNames.toString()}`
        );
    }
}

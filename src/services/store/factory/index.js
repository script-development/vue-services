/**
 * @typedef {import('../../http').HTTPService} HTTPService
 * @typedef {import('../../storage').StorageService} StorageService
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

import {BaseStoreModule} from './module';

export class StoreModuleFactory {
    /**
     * @param {HTTPService} httpService the http service for communication with the API
     * @param {StorageService} storageService the storage service for storing stuff in the browser
     */
    constructor(httpService, storageService) {
        this._httpService = httpService;
        this._storageService = storageService;
    }

    /**
     * Generate a default store module
     * @param {String} [endpoint] the optional endpoint for the API
     */
    createDefaultStore(endpoint) {
        // TODO :: make a base store module, which has only a state
        // and make a EndpointStoreModule, which extends the base and adds httpService actions
        return new BaseStoreModule(endpoint, this._httpService, this._storageService);
    }
}

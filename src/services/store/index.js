/**
 * @typedef {import('./factory').StoreModuleFactory} StoreModuleFactory
 * @typedef {import('../http').HTTPService} HTTPService
 * @typedef {import('vuex').Store} Store
 * @typedef {import('vuex').ModuleOptions} ModuleOptions
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

export class StoreService {
    /**
     *
     * @param {Store} store the store being used
     * @param {StoreModuleFactory} factory the factory being used to create store modules
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(store, factory, httpService) {
        this._store = store;
        this._factory = factory;
        this._httpService = httpService;

        this._moduleNames = [];

        this.setFactorySettings();

        this._httpService.registerResponseMiddleware(this.responseMiddleware);
    }

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
        return this._store.getters[moduleName + this.storeSeperator + getter];
    }

    /**
     * dispatch an action to the store
     *
     * @param {String} moduleName the name of the module to dispatch the action to
     * @param {String} action the name of the action
     * @param {*} payload the payload to sent to the action
     */
    dispatch(moduleName, action, payload) {
        return this._store.dispatch(moduleName + this.storeSeperator + action, payload);
    }

    /**
     * Get all from data from the given store module
     *
     * @param {String} storeModule the module from which to get all
     */
    getAllFromStore(storeModule) {
        return this._store.getters[storeModule + this.getReadAllGetter()];
    }

    /**
     * Get all data from the given store module by id
     *
     * @param {String} storeModule the module from which to get all
     * @param {String} id the id of the data object to get
     */
    getByIdFromStore(storeModule, id) {
        return this._store.getters[storeModule + this.getReadByIdGetter()](id);
    }

    /**
     * dispatch an action to the store, which deletes an item on the server
     *
     * @param {String} storeModule the store module for which an item must be deleted
     * @param {String} id the id of the item to be deleted
     */
    destroy(storeModule, id) {
        return this._store.dispatch(storeModule + this.getDeleteAction(), id);
    }

    /**
     * dispatch an action to the store, which updates an item on the server
     *
     * @param {String} storeModule the store module for which an item must be updated
     * @param {Object} item the item to be updated
     */
    update(storeModule, item) {
        return this._store.dispatch(storeModule + this.getUpdateAction(), item);
    }

    /**
     * dispatch an action to the store, which creates an item on the server
     *
     * @param {String} storeModule the store module for which an item must be created
     * @param {Object} item the item to be created
     */
    create(storeModule, item) {
        return this._store.dispatch(storeModule + this.getCreateAction(), item);
    }

    /**
     * dispatch an action to the store, which reads all items on the server
     *
     * @param {String} storeModule the store module for which all items must be read
     */
    read(storeModule) {
        return this._store.dispatch(storeModule + this.getReadAction());
    }

    /**
     * dispatch an action to the store, which reads an item on the server
     *
     * @param {String} storeModule the store module for which the item must be read
     * @param {Number} id the id to be read
     */
    show(storeModule, id) {
        return this._store.dispatch(storeModule + this.getShowAction(), id);
    }

    /**
     * Set all the data in the store module
     *
     * @param {String} storeModule the module to fill the data with
     * @param {*} data data to fill the store with
     */
    setAllInStore(storeModule, data) {
        return this._store.dispatch(storeModule + this.getSetAllInStoreAction(), data);
    }

    /**
     *  get the read all from store getter with or without seperator
     * @param {Boolean} seperator with or without seperator, default true
     */
    getReadAllGetter(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'all';
    }

    /**
     *  get the read by id from store getter with or without seperator
     * @param {Boolean} seperator with or without seperator, default true
     */
    getReadByIdGetter(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'byId';
    }

    /**
     *  get the read store action with or without seperator
     * @param {Boolean} seperator with or without seperator, default true
     */
    getReadAction(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'read';
    }

    /**
     *  get the read store action with or without seperator
     * @param {Boolean} seperator with or without seperator, default true
     */
    getShowAction(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'show';
    }

    /**
     *  get the delete store action with or without seperator
     * @param {Boolean} seperator with or without seperator, default true
     */
    getDeleteAction(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'destroy';
    }

    /**
     *  get the update store action with or without seperator
     * @param {Boolean} seperator with or without seperator, default true
     */
    getUpdateAction(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'update';
    }

    /**
     *  get the update store action with or without seperator
     * @param {Boolean} seperator with or without seperator, default true
     */
    getCreateAction(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'create';
    }

    /**
     *  get the set all in store action with or without seperator
     * @param {Boolean} seperator with or without seperator, default true
     */
    getSetAllInStoreAction(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'setAll';
    }

    /**
     *  get the all data in store state name with or without seperator
     * @param {Boolean} seperator with or without seperator, default true
     */
    getAllItemsStateName(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'data';
    }

    /**
     *  get the all data in store state name with or without seperator
     * @param {Boolean} seperator with or without seperator, default true
     */
    getSetAllMutation(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'SET_ALL';
    }

    /**
     *  get the all data in store state name with or without seperator
     * @param {Boolean} seperator with or without seperator, default true
     */
    getSetShowMutation(seperator = true) {
        return (seperator ? this.storeSeperator : '') + 'SET_SHOW';
    }

    /** get the store seperator */
    get storeSeperator() {
        return '/';
    }

    /** Set the factory name */
    setFactorySettings() {
        // set the factory action names
        this._factory.readAction = this.getReadAction(false);
        this._factory.createAction = this.getCreateAction(false);
        this._factory.updateAction = this.getUpdateAction(false);
        this._factory.deleteAction = this.getDeleteAction(false);
        this._factory.showAction = this.getShowAction(false);
        this._factory.setAllAction = this.getSetAllInStoreAction(false);

        // set the factory getter names
        this._factory.readAllGetter = this.getReadAllGetter(false);
        this._factory.readByIdGetter = this.getReadByIdGetter(false);

        // set the factory state names
        this._factory.allItemsStateName = this.getAllItemsStateName(false);

        // set the factory mutation names
        this._factory.setAllMutation = this.getSetAllMutation(false);
        this._factory._setShowMutation = this.getSetShowMutation(false);
    }

    /**
     * generate and set the default store module in the store
     *
     * @param {String} moduleName the name of the module
     * @param {String} [endpoint] the endpoint for the API
     * @param {ModuleOptions} extraFunctionality extra functionality added to the store
     */
    generateAndSetDefaultStoreModule(moduleName, endpoint, extraFunctionality) {
        const storeModule = this._factory.createDefaultStore(endpoint);

        if (extraFunctionality) {
            for (const key in extraFunctionality) {
                for (const name in extraFunctionality[key]) {
                    storeModule[key][name] = extraFunctionality[key][name];
                }
            }
        }

        this.registerModule(moduleName, storeModule);
    }

    /**
     * set the store module in the store
     *
     * @param {String} moduleName the name of the module
     * @param {ModuleOptions} storeModule the module to add to the store
     */
    registerModule(moduleName, storeModule) {
        this._moduleNames.push(moduleName);
        this._store.registerModule(moduleName, storeModule);
    }

    /**
     * create a new action to add to the store which sends a post request
     *
     * @param {String} actionName name of the new action
     * @param {String} endpoint api endpoint
     */
    createExtraPostAction(actionName, endpoint) {
        return this._factory.createExtraPostAction(actionName, endpoint);
    }

    /**
     * create a new action to add to the store which sends a get request
     *
     * @param {String} actionName name of the new action
     * @param {String} endpoint api endpoint
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    createExtraGetAction(actionName, endpoint, options) {
        return this._factory.createExtraGetAction(actionName, endpoint, options);
    }
}

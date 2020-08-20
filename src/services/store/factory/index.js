/**
 * @typedef {import('../../http').HTTPService} HTTPService
 * @typedef {import('../../storage').StorageService} StorageService
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */
import Vue from 'vue';

export class StoreModuleFactory {
    /**
     * @param {HTTPService} httpService the http service for communication with the API
     * @param {StorageService} storageService the storage service for storing stuff in the browser
     * @param {Boolean} [namespaced]
     */
    constructor(httpService, storageService, namespaced = true) {
        this._httpService = httpService;
        this._storageService = storageService;
        this._namespaced = namespaced;

        // getter naming
        /** @type {String} */ this._readAllGetter;
        /** @type {String} */ this._readByIdGetter;

        // state naming
        /** @type {String} */ this._allItemsStateName;

        // mutation naming
        /** @type {String} */ this._setAllMutation;
        /** @type {String} */ this._deleteMutation;

        // action naming
        /** @type {String} */ this._readAction;
        /** @type {String} */ this._updateAction;
        /** @type {String} */ this._createAction;
        /** @type {String} */ this._deleteAction;
        /** @type {String} */ this._setAllAction;
    }

    /**
     * Generate a default store module
     * @param {String} moduleName the name of the module
     * @param {String} [endpoint] the optional endpoint for the API
     */
    createDefaultStore(moduleName, endpoint) {
        return {
            namespaced: this._namespaced,
            state: this.createDefaultState(moduleName),
            getters: this.createDefaultGetters(),
            mutations: this.createDefaultMutations(moduleName),
            actions: this.createDefaultActions(endpoint),
        };
    }

    /** create default state for the store */
    createDefaultState(moduleName) {
        const stored = this._storageService.getItem(moduleName + this.allItemsStateName);
        return {[this.allItemsStateName]: stored ? JSON.parse(stored) : {}};
    }

    /** create default getters for the store */
    createDefaultGetters() {
        return {
            [this.readAllGetter]: state => {
                const data = state[this.allItemsStateName];
                // if not all keys are a number, then return as is
                if (Object.keys(data).some(key => isNaN(key))) return data;
                return Object.values(data);
            },
            [this.readByIdGetter]: state => id => state[this.allItemsStateName][id],
        };
    }

    /** create default mutations for the store */
    createDefaultMutations(moduleName) {
        return {
            [this.setAllMutation]: (state, allData) => {
                const stateName = this.allItemsStateName;
                if (!allData.length) {
                    // if allData is not an array but the state contains an array
                    // then allData probably has an id and then you can set it in the state
                    if (state[stateName].length && allData.id) {
                        Vue.set(state[stateName], allData.id, allData);
                    } else {
                        // else put allData as the state
                        state[stateName] = allData;
                    }
                } else if (allData.length === 1) {
                    // if allData has an array with 1 entry, put it in the state
                    Vue.set(state[stateName], allData[0].id, allData[0]);
                } else {
                    // if allData has more entries, then that's the new baseline
                    for (const id in state[stateName]) {
                        // search for new data entry
                        const newDataIndex = allData.findIndex(entry => entry.id == id);
                        // if not found, then delete entry
                        if (newDataIndex === -1) {
                            Vue.delete(state[stateName], id);
                            continue;
                        }
                        // remove new entry from allData, so further searches speed up
                        const newData = allData.splice(newDataIndex, 1)[0];

                        // if the entry for this id is larger then the current entry, do nothing
                        if (Object.values(state[stateName][id]).length > Object.values(newData).length) continue;

                        Vue.set(state[stateName], newData.id, newData);
                    }

                    // put all remaining new data in the state
                    for (const newData of allData) {
                        Vue.set(state[stateName], newData.id, newData);
                    }
                }

                this._storageService.setItem(moduleName + stateName, state[stateName]);
            },
            [this.deleteMutation]: (state, id) => {
                const stateName = this.allItemsStateName;
                Vue.delete(state[stateName], id);
                this._storageService.setItem(moduleName + stateName, state[stateName]);
            },
        };
    }

    /**
     * create default actions for the store
     * if the endpoint is given it also generates actions for the endpoint
     *
     * @param {String} [endpoint] optional endpoint for the API
     * */
    createDefaultActions(endpoint) {
        const actions = {
            [this.setAllAction]: ({commit}, allData) => commit(this.setAllMutation, allData),
        };

        if (!endpoint) return actions;

        actions[this.readAction] = (_, id) => this._httpService.get(endpoint + (id ? `/${id}` : ''));
        // TODO :: create and update could become one
        actions[this.createAction] = (_, item) => this._httpService.post(endpoint, item);
        actions[this.updateAction] = (_, item) => this._httpService.post(`${endpoint}/${item.id}`, item);
        actions[this.deleteAction] = (_, id) => this._httpService.delete(`${endpoint}/${id}`);

        return actions;
    }

    /**
     * create a new action to add to the store which sends a post request
     *
     * @param {String} endpoint api endpoint
     * @param {String} actionName the last part of the url
     */
    createExtraPostAction(endpoint, actionName) {
        return (_, payload) => this._httpService.post(`${endpoint}/${payload.id}/${actionName}`, payload);
    }

    /**
     * create a new action to add to the store which sends a get request
     *
     * @param {String} endpoint api endpoint
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    createExtraGetAction(endpoint, options) {
        return (_, payload) => this._httpService.get(endpoint + (payload ? `/${payload}` : ''), options);
    }

    // prettier-ignore
    get readAllGetter() { return this._readAllGetter; }

    // prettier-ignore
    set readAllGetter(value) { this._readAllGetter = value; }

    // prettier-ignore
    get readByIdGetter() { return this._readByIdGetter; }

    // prettier-ignore
    set readByIdGetter(value) { this._readByIdGetter = value; }

    // prettier-ignore
    get allItemsStateName() { return this._allItemsStateName; }

    // prettier-ignore
    set allItemsStateName(value) { this._allItemsStateName = value; }

    // prettier-ignore
    get setAllMutation() { return this._setAllMutation; }

    // prettier-ignore
    set setAllMutation(value) { this._setAllMutation = value; }

    // prettier-ignore
    get deleteMutation() { return this._deleteMutation; }

    // prettier-ignore
    set deleteMutation(value) { this._deleteMutation = value; }

    // prettier-ignore
    get readAction() { return this._readAction; }

    // prettier-ignore
    set readAction(value) { this._readAction = value; }

    // prettier-ignore
    get updateAction() { return this._updateAction; }

    // prettier-ignore
    set updateAction(value) { this._updateAction = value; }

    // prettier-ignore
    get createAction() { return this._createAction; }

    // prettier-ignore
    set createAction(value) { this._createAction = value; }

    // prettier-ignore
    get deleteAction() { return this._deleteAction; }

    // prettier-ignore
    set deleteAction(value) { this._deleteAction = value; }

    // prettier-ignore
    get setAllAction() { return this._setAllAction; }

    // prettier-ignore
    set setAllAction(value) { this._setAllAction = value; }
}

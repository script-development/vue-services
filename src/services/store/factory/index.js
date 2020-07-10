/**
 * @typedef {import('../../http').HTTPService} HTTPService
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

export class StoreModuleFactory {
    /**
     * @param {HTTPService} httpService
     * @param {Boolean} namespaced
     */
    constructor(httpService, namespaced = true) {
        this._namespaced = namespaced;
        this._httpService = httpService;

        // getter naming
        /** @type {String} */ this._readAllGetter;
        /** @type {String} */ this._readByIdGetter;

        // state naming
        /** @type {String} */ this._allItemsStateName;

        // mutation naming
        /** @type {String} */ this._setAllMutation;

        // action naming
        /** @type {String} */ this._readAction;
        /** @type {String} */ this._updateAction;
        /** @type {String} */ this._createAction;
        /** @type {String} */ this._deleteAction;
        /** @type {String} */ this._setAllAction;
    }

    /**
     * Generate a default store module
     * @param {String} [endpoint] the optional endpoint for the API
     */
    createDefaultStore(endpoint) {
        return {
            namespaced: this._namespaced,
            state: this.createDefaultState(),
            getters: this.createDefaultGetters(),
            mutations: this.createDefaultMutations(),
            actions: this.createDefaultActions(endpoint),
        };
    }

    /** create default state for the store */
    createDefaultState(allItemsStateName) {
        return {[this.allItemsStateName]: []};
    }

    /** create default getters for the store */
    createDefaultGetters() {
        return {
            [this.readAllGetter]: state => state[this.allItemsStateName],
            [this.readByIdGetter]: state => idToFind => state[this.allItemsStateName].find(({id}) => id == idToFind),
        };
    }

    /** create default mutations for the store */
    createDefaultMutations() {
        return {
            [this.setAllMutation]: (state, allData) => {
                const stateData = state[this.allItemsStateName];
                if (!allData.length) return (stateData = allData);

                for (const data of allData) {
                    const idData = stateData[data.id];
    
                    // if the data for this id already exists and is larger then the current entry, do nothing
                    if (idData && Object.values(idData).length > Object.values(data).length) continue;
    
                    Vue.set(stateData, data.id, data);
                }
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

        actions[this.readAction] = () => this._httpService.get(endpoint);
        actions[this.createAction] = (_, item) => this._httpService.post(endpoint, item);
        actions[this.updateAction] = (_, item) => this._httpService.post(`${endpoint}/${item.id}`, item);
        actions[this.deleteAction] = (_, id) => this._httpService.delete(`${endpoint}/${id}`);

        return actions;
    }

    /**
     * create a new action to add to the store which sends a post request
     *
     * @param {String} actionName name of the new action
     * @param {String} endpoint api endpoint
     */
    createExtraPostAction(actionName, endpoint) {
        return {
            actions: {
                [actionName]: (_, payload) =>
                    this._httpService.post(`${endpoint}/${payload.id}/${actionName}`, payload),
            },
        };
    }

    /**
     * create a new action to add to the store which sends a get request
     *
     * @param {String} actionName name of the new action
     * @param {String} endpoint api endpoint
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    createExtraGetAction(actionName, endpoint, options) {
        return {
            actions: {
                [actionName]: (_, payload) => this._httpService.get(endpoint + payload ? `/${payload}` : '', options),
            },
        };
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

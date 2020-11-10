/**
 * @typedef {import('../../http').HTTPService} HTTPService
 * @typedef {import('../../storage').StorageService} StorageService
 */
import {ref, computed} from 'vue';

// TODO :: documentation

export class BaseStoreModule {
    /**
     * @param {String} endpoint the endpoint
     * @param {StorageService} storageService the storage service for storing stuff in the browser
     * @param {HTTPService} httpService the service that makes the requests
     */
    constructor(endpoint, httpService, storageService) {
        this._endpoint = endpoint;
        this._httpService = httpService;
        this._storageService = storageService;

        // Check if data is stored, if so load that, else empty
        const stored = this._storageService.getItem(endpoint);
        this._state = ref(stored ? JSON.parse(stored) : {});
    }

    // getters
    get all() {
        return computed(() => {
            const data = this._state.value;
            // if data is not of type object, return as is
            if (typeof data !== 'object') return data;

            // if not all keys are a number, then return as is
            if (Object.keys(data).some(key => isNaN(key))) return data;

            return Object.values(data);
        });
    }

    byId(id) {
        return this.all[id];
    }

    // mutations
    setAll(data) {
        if (!data.length) {
            // if data is not an array but the state contains an array
            // then data probably has an id and then you can set it in the state
            if (this._state.value.length && data.id) {
                // TODO :: vue-3 :: check if vue-3 is reactive this way
                this._state.value[data.id] = data;
            } else {
                // else put data as the state
                this._state.value = data;
            }
        } else if (data.length === 1) {
            // if data has an array with 1 entry, put it in the state
            this._state.value[data[0].id] = data[0];
        } else {
            // if data has more entries, then that's the new baseline
            for (const id in this._state.value) {
                // search for new data entry
                const newDataIndex = data.findIndex(entry => entry.id == id);
                // if not found, then delete entry
                if (newDataIndex === -1) {
                    // TODO :: vue-3 :: check if vue-3 is reactive this way
                    delete this._state.value[id];
                    continue;
                }
                // remove new entry from data, so further searches speed up
                const newData = data.splice(newDataIndex, 1)[0];

                // if the entry for this id is larger then the current entry, do nothing
                if (Object.values(this._state.value[id]).length > Object.values(newData).length) continue;

                this._state.value[newData.id] = newData;
            }

            // put all remaining new data in the state
            for (const newData of data) {
                this._state.value[newData.id] = newData;
            }
        }

        this._storageService.setItem(this._endpoint, JSON.stringify(this._state.value));
    }

    deleteEntryById(id) {
        delete this._state.value[id];
        this._storageService.setItem(this._endpoint, JSON.stringify(this._state.value));
    }

    // actions
    get(id) {
        return this._httpService.get(this._endpoint + (id ? `/${id}` : ''));
    }

    post(item) {
        return this._httpService.post(this._endpoint + (item.id ? `/${item.id}` : ''), item);
    }

    delete(id) {
        return this._httpService.delete(`${this._endpoint}/${id}`);
    }
}

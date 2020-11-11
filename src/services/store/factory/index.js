/**
 * @typedef {import('../../../../types/types').State} State
 * @typedef {import('../../../../types/types').Item} Item
 * @typedef {import('../../../../types/types').ExtraStoreFunctionality} ExtraStoreFunctionality
 * @typedef {import('../../../../types/services/store').StoreModule} StoreModule
 */
import {computed, ref} from 'vue';
import {getItemFromStorage, setItemInStorage} from '../../storage';

/**
 * Creates a store module for the given module name.
 * When extra store functionality is given, it will extend the base module with the extra functionality.
 *
 * @param {string} moduleName the name of the module, also the endpoint for the module
 * @param {ExtraStoreFunctionality} [extraFunctionality] the optional extra functionality to add to the store
 *
 * @returns {StoreModule}
 */
export default (moduleName, extraFunctionality) => {
    /** @type {State} */
    const state = ref(getItemFromStorage(moduleName, true) ?? {});

    const storeModule = {
        /** Get all items from the store */
        all: computed(() => Object.values(state.value)),
        /**
         * Get an item from the state by id
         *
         * @param {string} id
         * @returns {Item}
         */
        byId: id => state.value[id],
        /**
         * Set data in the state.
         * Data can be of any kind.
         *
         * @param {any} data the data to set
         */
        setAll: data => {
            if (!data.length) {
                // if data is not an array but the state contains an array
                // then data probably has an id and then you can set it in the state
                if (state.value.length && data.id) {
                    // TODO :: vue-3 :: check if vue-3 is reactive this way
                    state.value[data.id] = data;
                } else {
                    // else put data as the state
                    state.value = data;
                }
            } else if (data.length === 1) {
                // if data has an array with 1 entry, put it in the state
                state.value[data[0].id] = data[0];
            } else {
                // if data has more entries, then that's the new baseline
                for (const id in state.value) {
                    // search for new data entry
                    const newDataIndex = data.findIndex(entry => entry.id == id);
                    // if not found, then delete entry
                    if (newDataIndex === -1) {
                        // TODO :: vue-3 :: check if vue-3 is reactive this way
                        delete state.value[id];
                        continue;
                    }
                    // remove new entry from data, so further searches speed up
                    const newData = data.splice(newDataIndex, 1)[0];

                    // if the entry for this id is larger then the current entry, do nothing
                    if (Object.values(state.value[id]).length > Object.values(newData).length) continue;

                    state.value[newData.id] = newData;
                }

                // put all remaining new data in the state
                for (const newData of data) {
                    state.value[newData.id] = newData;
                }
            }

            setItemInStorage(moduleName, state.value);
        },
    };

    if (extraFunctionality) return {...storeModule, ...extraFunctionality};

    return storeModule;
};

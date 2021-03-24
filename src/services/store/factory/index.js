/**
 * @typedef {import('../../../../types/types').State} State
 * @typedef {import('../../../../types/types').Item} Item
 * @typedef {import('../../../../types/services/store').StoreModule} StoreModule
 */
import {computed, ref} from 'vue';
import {getItemFromStorage, setItemInStorage} from '../../storage';
import {deepCopy} from '../../../helpers';

// TODO :: it makes it a lot easier if we only handle id based items
// changing it to only id based items, need to check if it can handle it
// TODO :: JSDoc and vsCode can't handle the Item|Item[] parameter

/**
 * Creates a store module for the given module name.
 * When extra store functionality is given, it will extend the base module with the extra functionality.
 *
 * @param {string} moduleName the name of the module, also the endpoint for the module
 *
 * @returns {StoreModule}
 */
export default moduleName => {
    /** @type {State} */
    const state = ref(getItemFromStorage(moduleName, true, {}));

    return {
        /** Get all items from the store */
        all: computed(() => Object.values(state.value)),
        /**
         * Get an item from the state by id
         *
         * @param {number} id
         */
        byId: id => computed(() => state.value[id]),
        /**
         * Set data in the state.
         * Data can be of any kind.
         *
         * @param {Item|Item[]} incomingData the data to set
         */
        setAll: incomingData => {
            // Making a deep copy of the data, because we don't want to edit the original data
            // The original data could be used elsewhere
            const data = deepCopy(incomingData);

            if (!('length' in data)) {
                data;
                // if data is not an array it probably recieves a single item with an id
                // if that's not the case then return
                if (!data.id) return;

                state.value[data.id] = Object.freeze(data);
            } else if (data.length === 1) {
                // if data has an array with 1 entry, put it in the state
                state.value[data[0].id] = Object.freeze(data[0]);
            } else {
                // if data has more entries, then that's the new baseline
                for (const id in state.value) {
                    // search for new data entry
                    const newDataIndex = data.findIndex(entry => entry.id === parseInt(id));
                    // if not found, then delete entry
                    if (newDataIndex === -1) {
                        delete state.value[id];
                        continue;
                    }
                    // remove new entry from data, so further searches speed up
                    const newData = data.splice(newDataIndex, 1)[0];

                    // if the entry for this id is larger then the current entry, do nothing
                    if (Object.values(state.value[id]).length > Object.values(newData).length) continue;

                    state.value[newData.id] = Object.freeze(newData);
                }

                // put all remaining new data in the state
                for (const newData of data) {
                    state.value[newData.id] = Object.freeze(newData);
                }
            }

            setItemInStorage(moduleName, state.value);
        },
    };
};

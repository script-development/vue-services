/**
 * @typedef {import('../../../types/services/store').Store} Store
 * @typedef {import('../../../types/services/store').StoreModuleFactory} StoreModuleFactory
 * @typedef {import('../../../types/types').StaticDataTypes} StaticDataTypes
 */
import {getRequestWithoutCache} from '../http';
import StoreModuleFactory from '../store/factory';
import msgpack from '@msgpack/msgpack';

const MSG_PACK_DATA_TYPE = 'msg-pack';

const apiStaticDataEndpoint = 'staticdata';

/** Exporting for testing purposes */
export const DATA = {
    /** @type {string[]} */
    normal: [],
    /** @type {string[]} */
    msgpack: [],
};

/**
 * Exporting for testing purposes
 *
 * @type {Store}
 */
export const store = {};

/**
 * initiates the setup for the default store modules
 *
 * @param {StaticDataTypes} data
 */
export const createStaticDataStoreModules = data => {
    for (const staticDataNameOrObject of data) {
        if (typeof staticDataNameOrObject == 'string') {
            store[staticDataNameOrObject] = StoreModuleFactory(staticDataNameOrObject);
            DATA.normal.push(staticDataNameOrObject);
            continue;
        }

        for (const staticDataName in staticDataNameOrObject) {
            if (staticDataNameOrObject[staticDataName] === MSG_PACK_DATA_TYPE) {
                createStoreModuleMsgPack(staticDataName);
            }
        }
    }
};

/**
 * Create module for static data with msg-pack lite(peerDependencies)
 *
 * @param {string} staticDataName
 */
export const createStoreModuleMsgPack = staticDataName => {
    store[staticDataName] = StoreModuleFactory(staticDataName);
    DATA.msgpack.push(staticDataName);
};

/**
 * Sends requests to the server which recieves all the staticdata from the server defined in DATA
 */
export const getStaticDataFromServer = async () => {
    const response = await getRequestWithoutCache(apiStaticDataEndpoint);

    for (const staticDataName of DATA.normal) {
        store[staticDataName].setAll(response.data[staticDataName]);
    }

    for (const staticDataName of DATA.msgpack) {
        const response = await getRequestWithoutCache(staticDataName, {responseType: 'arraybuffer'});

        if (!msgpack) {
            console.error('MESSAGE PACK NOT INSTALLED');
            console.warn('run the following command to install messagepack: npm --save @msgpack/msgpack');
            return response;
        }

        store[staticDataName].setAll(msgpack.decode(new Uint8Array(response.data)));
    }

    return response;
};

/**
 * Get all from a specific segment in the staticdata store
 *
 * @param {string} staticDataName the name of the segement to get data from
 */
export const getStaticDataSegment = staticDataName => store[staticDataName].all.value;

/**
 * Get all data from the given staticDataName by id
 *
 * @param {string} staticDataName the name of the segement to get data from
 * @param {number} id the id of the data object to get
 */
export const getStaticDataItemById = (staticDataName, id) => store[staticDataName].byId(id).value;

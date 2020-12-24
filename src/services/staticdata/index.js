/**
 * @typedef {import('../../../types/services/store').Store} Store
 * @typedef {import('../../../types/services/store').registerStoreModule} registerStoreModule
 * @typedef {import('../../../types/services/store').StoreModuleFactory} StoreModuleFactory
 * @typedef {import('../../../types/types').StaticDataTypes} StaticDataTypes
 */

import {registerStoreModule} from '../store';
import {getRequest} from '../http';
import StoreModuleFactory from '../store/factory';

/**
 * Define msgpack for later use
 */
let msgpack;
/**
 * Gives a warning in webpack, check this issue: https://github.com/webpack/webpack/issues/7713
 * this is the way to go for now
 *
 * to ignore this error, add the following webpack config in webpack.config.js:
 * {externals: {'@msgpack/msgpack': true}}
 *
 * or when using 'laravel-mix', the following to webpack.mix.js:
 * mix.webpackConfig({externals: {'@msgpack/msgpack': 'msgpack'}});
 */
try {
    msgpack = require('@msgpack/msgpack');
    // eslint-disable-next-line
} catch (error) {}

const MSG_PACK_DATA_TYPE = 'msg-pack';

const apiStaticDataEndpoint = 'staticdata';

/** Exporting for testing purposes */
export const DATA = {
    normal: [],
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
    if (!msgpack) {
        console.error('MESSAGE PACK NOT INSTALLED');
        return console.warn('run the following command to install messagepack: npm --save @msgpack/msgpack');
    }
    store[staticDataName] = StoreModuleFactory(staticDataName);
    DATA.msgpack.push(staticDataName);
};

/**
 * Sends requests to the server which recieves all the staticdata from the server defined in DATA
 */
export const getStaticDataFromServer = async () => {
    const response = await getRequest(apiStaticDataEndpoint);

    for (const staticDataName of DATA.normal) {
        store[staticDataName].setAll(response.data[staticDataName]);
    }

    for (const staticDataName of DATA.msgpack) {
        const response = await getRequest(staticDataName, {responseType: 'arraybuffer'});

        store[staticDataName].setAll(msgpack.decode(new Uint8Array(response.data)));
    }
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
 * @param {string} id the id of the data object to get
 */
export const getStaticDataItemById = (staticDataName, id) => store[staticDataName].byId(id).value;

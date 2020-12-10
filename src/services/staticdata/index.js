/**
 * @typedef {import('../../../types/services/store').Store} Store
 * @typedef {import('../../../types/services/store').registerStoreModule} registerStoreModule
 * @typedef {import('../../../types/services/store/factory').StoreModuleFactory} StoreModuleFactory
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

const DATA = {
    normal: [],
    msgpack: [],
};

/** @type {Store} */
const store = {};

/**
 * initiates the setup for the default store modules
 *
 * @param {[string,Object<string,string>]} data Modulenames
 */
export const createStoreModules = data => {
    for (const moduleName of data) {
        if (typeof moduleName == 'string') {
            store[moduleName] = StoreModuleFactory(moduleName);
            DATA.normal.push(moduleName);
        } else if (typeof moduleName == 'object' && Object.values(moduleName) == MSG_PACK_DATA_TYPE) {
            createStoreModuleMsgPack(Object.keys(moduleName).toString());
        }
    }
};

/**
 * Create module for static data with msg-pack lite(peerDependencies)
 *
 * @param {string} storeModuleName Modulenames
 */
export const createStoreModuleMsgPack = storeModuleName => {
    if (!msgpack) {
        console.error('MESSAGE PACK NOT INSTALLED');
        return console.warn('run the following command to install messagepack: npm --save @msgpack/msgpack');
    }

    const storeModule = StoreModuleFactory(storeModuleName);

    getRequest(storeModuleName, {responseType: 'arraybuffer'}).then(response => {
        storeModule.setAll(storeModuleName, msgpack.decode(new Uint8Array(response.data)));
        return response;
    });
    registerStoreModule(storeModuleName, storeModule);
};

/**
 * Sends an action to the store which reads all the staticdata from the server defined in the 'constants/staticdata.js' file
 */
export const getStaticData = async () => {
    const response = await getRequest(apiStaticDataEndpoint);

    for (const staticDataName of DATA.normal) {
        store[staticDataName].setAll(response.data[staticDataName]);
    }
};

/**
 * Get all from a specifid segment in the staticdata store
 *
 * @param {String} data the module from which to get all
 */
export const getStaticDataSegment = data => store[data].all;

/**
 * Get all data from the given store module by id
 *
 * @param {String} data the module from which to get all
 * @param {Number} id the id of the data object to get
 */
export const byId = (data, id) => store[data].byId(id);

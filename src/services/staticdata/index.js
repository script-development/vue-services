/**
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../http').HTTPService} HTTPService
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

export class StaticDataService {
    /**
     * @param {StoreService} storeService
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(storeService, httpService) {
        this._storeService = storeService;
        this._httpService = httpService;

        this._data = {
            normal: [],
            msgpack: [],
        };

        this._apiStaticDataEndpoint = 'staticdata';
    }
    /**
     * initiates the setup for the default store modules
     *
     * @param {[string,Object<string,string>]} data Modulenames
     */
    createStoreModules(data) {
        for (const moduleName of data) {
            if (typeof moduleName == 'string') {
                this.createStoreModule(moduleName);
            } else if (typeof moduleName == 'object' && Object.values(moduleName) == MSG_PACK_DATA_TYPE) {
                this.createStoreModuleMsgPack(Object.keys(moduleName).toString());
            }
        }
    }

    /**
     * Creates and registers modules for the staticdata
     *
     * @param {string} storeModuleName Modulenames
     */
    createStoreModule(storeModuleName) {
        this._data.normal.push(storeModuleName);

        this._storeService.generateAndSetDefaultStoreModule(storeModuleName);
    }

    /**
     * Create module for static data with msg-pack lite(peerDependencies)
     *
     * @param {string} storeModuleName Modulenames
     */
    createStoreModuleMsgPack(storeModuleName) {
        if (!msgpack) {
            console.error('MESSAGE PACK NOT INSTALLED');
            return console.warn('run the following command to install messagepack: npm --save @msgpack/msgpack');
        }
        this._data.msgpack.push(storeModuleName);

        const storeModule = this._storeService._factory.createDefaultStore(storeModuleName);
        storeModule.actions[this._storeService._factory.readAction] = () =>
            this._httpService.get(storeModuleName, {responseType: 'arraybuffer'}).then(response => {
                this._storeService.setAllInStore(storeModuleName, msgpack.decode(new Uint8Array(response.data)));
                return response;
            });
        this._storeService.registerModule(storeModuleName, storeModule);
    }

    /**
     * Sends an action to the store which reads all the staticdata from the server defined in the 'constants/staticdata.js' file
     */
    getStaticData() {
        this._httpService.get(this._apiStaticDataEndpoint);

        for (const staticDataName of this._data.msgpack) {
            this._storeService.read(staticDataName);
        }
    }

    /**
     * Get all from data from the given store module
     *
     * @param {String} data the module from which to get all
     */
    getAll(data) {
        return this._storeService.getAllFromStore(data);
    }

    /**
     * Get all data from the given store module by id
     *
     * @param {String} data the module from which to get all
     * @param {Number} id the id of the data object to get
     */
    getById(data, id) {
        return this._storeService.getByIdFromStore(data, id);
    }
}

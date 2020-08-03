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
 * mix.webpackConfig({externals: {'@msgpack/msgpack': true}});
 */
try {
    msgpack = require('@msgpack/msgpack');
} catch (error) {}

export class StaticDataService {
    /**
     * @param {StoreService} storeService
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(storeService, httpService) {
        this._storeService = storeService;
        this._httpService = httpService;

        this._data;
    }
    /**
     * Create new route settings
     *
     * @param {[string,Object<string,string>]} storeModuleName Modulenames
     */
    createStoreModules(data) {
        this._data = data;
        for (const moduleName of this._data) {
            if (typeof moduleName == 'string') {
                this.createStoreModule(moduleName);
            } else if (typeof moduleName == 'object' && Object.values(moduleName) == 'msg-pack') {
                this.createStoreModuleMsgPack(Object.keys(moduleName).toString());
            }
        }
    }

    /**
     * Create module for static data
     *
     * @param {[string,Object<string,string>]} storeModuleName Modulenames
     */
    createStoreModule(storeModuleName) {
        this._storeService.generateAndSetDefaultStoreModule(storeModuleName);
    }

    /**
     * Create module for static data with msg-pack lite(peerDependencies)
     *
     * @param {[string,Object<string,string>]} storeModuleName Modulenames
     */
    createStoreModuleMsgPack(storeModuleName) {
        if (!msgpack) {
            console.error('MESSAGE PACK NOT INSTALLED');
            return console.warn('run the following command to install messagepack: npm --save @msgpack/msgpack');
        }
        const storeModule = this._storeService._factory.createDefaultStore(storeModuleName);
        storeModule.actions[this._storeService._factory.readAction] = () =>
            this._httpService.get(storeModuleName, {responseType: 'arraybuffer'}).then(response => {
                this._storeService.setAllInStore(storeModuleName, msgpack.decode(new Uint8Array(response.data)));
                return response;
            });
        this._storeService.registerModule(storeModuleName, storeModule);
    }

    /**
     * TODO :: @Methox - documentation
     */
    getStaticData() {
        this._httpService.get('staticdata');
        for (const staticDataName of this._data) {
            if (typeof staticDataName == 'object') {
                this._storeService.read(Object.keys(staticDataName).toString());
            }
        }
    }

    /**
     * TODO :: @Methox - documentation
     *
     * @param {*} data
     */
    getAll(data) {
        return this._storeService.getAllFromStore(data);
    }

    /**
     * TODO :: @Methox - documentation
     *
     * @param {*} data
     * @param {*} id
     */
    getById(data, id) {
        return this._storeService.getByIdFromStore(data, id);
    }
}

/**
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../http').HTTPService} HTTPService
 */
import msgpack from '@msgpack/msgpack';

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
        const storeModule = this._storeService._factory.createDefaultStore(storeModuleName);
        storeModule.actions[this._storeService._factory.readAction] = () =>
            this._httpService.get(storeModuleName, {responseType: 'arraybuffer'}).then(response => {
                this._storeService.setAllInStore(storeModuleName, msgpack.decode(new Uint8Array(response)));
                return response;
            });
        this._storeService.registerModule(storeModuleName, storeModule);
    }

    getStaticData() {
        this._httpService.get('staticdata');
        for (const staticDataName of this._data) {
            if (typeof staticDataName == 'object') {
                this._storeService.read(Object.keys(staticDataName).toString());
            }
        }
    }

    getAll(staticdata) {
        return this._storeService.getAllFromStore(staticdata);
    }
}

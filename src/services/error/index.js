/**
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../router').RouterService} RouterService
 * @typedef {import('../http').HTTPService} HTTPService
 */
// TODO :: use a standard or must it be set?
import NotFoundPage from '../../pages/errors/404';

export class ErrorService {
    /**
     *
     * @param {StoreService} storeService
     * @param {RouterService} routerService
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(storeService, routerService, httpService) {
        this._storeModuleName = 'errors';
        this._storeService = storeService;

        this._storeService.generateAndSetDefaultStoreModule(this._storeModuleName, '', {
            getters: {[this._storeModuleName]: state => state[this._storeService.getAllItemsStateName(false)]},
        });

        this._routerService = routerService;
        this._routerService.addRoutes([
            {
                path: '*',
                component: NotFoundPage,
                meta: {
                    title: 'Pagina niet gevonden',
                    auth: true,
                },
            },
        ]);

        this._routerService.registerAfterMiddleware(this.routeMiddleware);

        this._httpService = httpService;
        this._httpService.registerResponseErrorMiddleware(this.responseErrorMiddleware);
    }

    getErrors() {
        return this._storeService.get(this._storeModuleName, this._storeModuleName);
    }

    setErrors(errors) {
        this._storeService.setAllInStore(this._storeModuleName, errors);
    }

    destroyErrors() {
        this.setErrors({});
    }

    get responseErrorMiddleware() {
        return ({response}) => {
            if (response && response.data.errors) this.setErrors(response.data.errors);
        };
    }

    get routeMiddleware() {
        return (to, from) => this.setErrors({});
    }
}

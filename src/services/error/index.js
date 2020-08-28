/**
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../router').RouterService} RouterService
 * @typedef {import('../router').AfterMiddleware} AfterMiddleware
 * @typedef {import('../http').HTTPService} HTTPService
 * @typedef {import('../http').ResponseErrorMiddleware} ResponseErrorMiddleware
 *
 * @typedef {Object.<string, string[]} ErrorBag
 */
// TODO :: use a standard or must it be set?
import NotFoundPage from '../../pages/errors/404';

const STORE_MODULE_NAME = 'errors';

export class ErrorService {
    /**
     * @param {StoreService} storeService
     * @param {RouterService} routerService
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(storeService, routerService, httpService) {
        this._storeService = storeService;

        this._storeService.generateAndSetDefaultStoreModule(STORE_MODULE_NAME, '', {
            getters: {[STORE_MODULE_NAME]: state => state[this._storeService.getAllItemsStateName(false)]},
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

    /**
     * Get all the known errors
     * @returns {ErrorBag}
     */
    getErrors() {
        return this._storeService.get(STORE_MODULE_NAME, STORE_MODULE_NAME);
    }

    /**
     * Store the given errors, overriding every known error
     *
     * @param {ErrorBag} errors
     */
    setErrors(errors) {
        this._storeService.setAllInStore(STORE_MODULE_NAME, errors);
    }

    // prettier-ignore
    /** Clear every known error */
    destroyErrors() { this.setErrors({}); }

    /** @returns {ResponseErrorMiddleware} */
    get responseErrorMiddleware() {
        return ({response}) => {
            if (response && response.data.errors) this.setErrors(response.data.errors);
        };
    }

    /** @returns {AfterMiddleware} */
    get routeMiddleware() {
        return _ => this.setErrors({});
    }
}

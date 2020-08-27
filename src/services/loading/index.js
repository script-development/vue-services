/**
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../http').HTTPService} HTTPService
 * @typedef {import('../http').RequestMiddleware} RequestMiddleware
 * @typedef {import('../http').ResponseMiddleware} ResponseMiddleware
 * @typedef {import('../http').ResponseErrorMiddleware} ResponseErrorMiddleware
 */

export class LoadingService {
    /**
     *
     * @param {StoreService} storeService
     * @param {HTTPService} httpService
     */
    constructor(storeService, httpService) {
        // TODO :: do i even need a store? yes i do! cause of computed, can change with vue3
        this._storeModuleName = 'loading';
        this._storeService = storeService;

        this._storeService.generateAndSetDefaultStoreModule(this._storeModuleName);
        this.loading = false;

        // time after which the spinner should show
        this.spinnerTimeout = 500;
        // time the spinner is minimal active
        this.minTimeSpinner = 1000;

        this.loadingTimeoutId;
        this.loadingTimeStart;

        httpService.registerRequestMiddleware(this.requestMiddleware);
        httpService.registerResponseMiddleware(this.responseMiddleware);
        httpService.registerResponseErrorMiddleware(this.responseMiddleware);
    }

    /**
     * get the loading state
     *
     * @returns {Boolean}
     */
    get loading() {
        // TODO :: loading somehow still an array at start, first this fix
        return !!this._storeService.getAllFromStore(this._storeModuleName);
    }

    /**
     * Set the loading state
     *
     * @param {Boolean} loading the loading state
     */
    set loading(loading) {
        if (this.loadingTimeoutId) clearTimeout(this.loadingTimeoutId);

        let timeout = this.spinnerTimeout;

        if (loading) {
            // set the time the loading started
            this.loadingTimeStart = Date.now();
        } else if (this.loadingTimeStart) {
            // get the response time from the request
            const responseTime = Date.now() - this.loadingTimeStart;
            // check the time the spinner is already active and how many ms it should stay active to get to the min time of the spinner
            timeout = this.minTimeSpinner - responseTime + this.spinnerTimeout;
            if (timeout < 0) timeout = 0;
        }

        this.loadingTimeoutId = setTimeout(
            () => this._storeService.setAllInStore(this._storeModuleName, loading),
            timeout
        );
    }

    /** @returns {RequestMiddleware} */
    get requestMiddleware() {
        return () => (this.loading = true);
    }

    /** @returns {ResponseMiddleware | ResponseErrorMiddleware} */
    get responseMiddleware() {
        return () => (this.loading = false);
    }
}

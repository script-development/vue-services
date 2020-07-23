/**
 * @typedef {import('../services/router').RouterService} RouterService
 * @typedef {import('../services/event').EventService} EventService
 * @typedef {import('../services/auth').AuthService} AuthService
 * @typedef {import('../creators/pages').PageCreator} PageCreator
 */

export class AppStarter {
    /**
     * @param {RouterService} routerService
     * @param {EventService} eventService
     * @param {AuthService} authService
     * @param {PageCreator} pageCreator
     */
    constructor(routerService, eventService, authService, pageCreator) {
        this._routerService = routerService;
        this._eventService = eventService;
        this._authService = authService;
        this._pageCreator = pageCreator;
    }

    start(mainComponent, defaultLoggedInPage, loginPage) {
        this._authService.defaultLoggedInPage = defaultLoggedInPage;
        this._authService.loginPage = loginPage;
        this._authService.setRoutes();

        this._eventService.app = new Vue({
            el: '#app',
            router: this._routerService._router,
            // store: storeService._store,
            render: h => {
                this._pageCreator.init(h);
                return h(App);
            },
        });
    }
}

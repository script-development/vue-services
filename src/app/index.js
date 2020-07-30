/**
 * @typedef {import('../services/router').RouterService} RouterService
 * @typedef {import('../services/event').EventService} EventService
 * @typedef {import('../services/auth').AuthService} AuthService
 * @typedef {import('../services/staticdata').StaticDataService} StaticDataService
 * @typedef {import('../creators/pages').PageCreator} PageCreator
 * @typedef {import('vue').Component} Component
 */

import Vue from 'vue';

export class AppStarter {
    /**
     * @param {RouterService} routerService
     * @param {EventService} eventService
     * @param {AuthService} authService
     * @param {StaticDataService} staticDataService
     * @param {PageCreator} pageCreator
     */
    constructor(routerService, eventService, authService, staticDataService, pageCreator) {
        this._routerService = routerService;
        this._eventService = eventService;
        this._authService = authService;
        this._staticDataService = staticDataService;
        this._pageCreator = pageCreator;
    }

    /**
     * Start the app and set required settings
     *
     * @param {Component} mainComponent the main app component
     * @param {String} defaultLoggedInPage the page to go to when logged in
     * @param {Component} loginPage the login page
     * @param {[string,Object<string,string>]} [staticData] the static data
     */
    start(mainComponent, defaultLoggedInPage, loginPage, staticData) {
        if (staticData) this._staticDataService.createStoreModules(staticData);

        this._authService.defaultLoggedInPage = defaultLoggedInPage;
        this._authService.loginPage = loginPage;
        this._authService.setRoutes();

        this._eventService.app = new Vue({
            el: '#app',
            router: this._routerService.router,
            render: h => {
                this._pageCreator.init(h);
                return h(mainComponent);
            },
        });
    }
}

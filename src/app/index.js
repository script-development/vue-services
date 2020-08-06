/**
 * @typedef {import('../services/router').RouterService} RouterService
 * @typedef {import('../services/event').EventService} EventService
 * @typedef {import('../services/auth').AuthService} AuthService
 * @typedef {import('../services/staticdata').StaticDataService} StaticDataService
 * @typedef {import('../creators/pages').PageCreator} PageCreator
 * @typedef {import('../controllers').BaseController} BaseController
 * @typedef {import('vue').Component} Component
 */

import Vue from 'vue';

export class AppStarter {
    /**
     * @param {RouterService} routerService
     * @param {EventService} eventService
     * @param {AuthService} authService
     * @param {StaticDataService} staticDataService
     * @param {Function} creatorInit
     */
    constructor(routerService, eventService, authService, staticDataService, creatorInit) {
        this._routerService = routerService;
        this._eventService = eventService;
        this._authService = authService;
        this._staticDataService = staticDataService;
        this._creatorInit = creatorInit;
    }

    /**
     * Start the app and set required settings
     *
     * @param {Component} mainComponent the main app component
     * @param {String} defaultLoggedInPage the page to go to when logged in
     * @param {Component} loginPage the login page
     * @param {Object<string,BaseController>} controllers the login page
     * @param {[string,Object<string,string>]} [staticData] the static data
     */
    start(mainComponent, defaultLoggedInPage, loginPage, controllers, staticData) {
        if (staticData) this._staticDataService.createStoreModules(staticData);

        this._authService.defaultLoggedInPage = defaultLoggedInPage;
        this._authService.loginPage = loginPage;
        this._authService.setRoutes();

        this._eventService.app = new Vue({
            el: '#app',
            router: this._routerService.router,
            render: h => {
                this._creatorInit(h);
                return h(mainComponent);
            },
        });

        // TODO :: placing it here is giving warnings that routes don't exist
        for (const controller in controllers) controllers[controller].init();
    }
}

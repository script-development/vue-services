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
     */
    constructor(routerService, eventService, authService, staticDataService) {
        this._routerService = routerService;
        this._eventService = eventService;
        this._authService = authService;
        this._staticDataService = staticDataService;
    }

    /**
     * Start the app and set required settings
     *
     * @param {Component} mainComponent the main app component
     * @param {String} defaultLoggedInPageName the page to go to when logged in
     * @param {Component} loginPage the login page
     * @param {Object<string,BaseController>} controllers the login page
     * @param {[string,Object<string,string>]} [staticData] the static data
     */
    start(mainComponent, defaultLoggedInPageName, loginPage, controllers, staticData) {
        if (staticData) this._staticDataService.createStoreModules(staticData);

        this._authService.defaultLoggedInPageName = defaultLoggedInPageName;
        this._authService.loginPage = loginPage;
        this._authService.setRoutes();

        for (const controller in controllers) controllers[controller].init();

        this._eventService.app = new Vue({
            el: '#app',
            router: this._routerService.router,
            render: h => h(mainComponent),
        });

        // TODO :: could even do this first and .then(()=>this._authService.getLoggedInUser())
        // or make it a setting
        if (this._authService.isLoggedin) this._authService.getLoggedInUser();
    }
}

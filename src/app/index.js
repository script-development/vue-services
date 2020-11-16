/**
 * @typedef {import('../services/router').RouterService} RouterService
 * @typedef {import('../services/event').EventService} EventService
 * @typedef {import('../services/auth').AuthService} AuthService
 * @typedef {import('../services/staticdata').StaticDataService} StaticDataService
 * @typedef {import('../controllers').BaseController} BaseController
 * @typedef {import('vue').Component} Component
 */

import {createApp} from 'vue';
import {router} from '../services/router';

/**
 * Start the app and set required settings
 *
 * @param {Component} mainComponent the main app component
 * @param {String} defaultLoggedInPageName the page to go to when logged in
 * @param {Component} loginPage the login page
 * @param {Object<string,BaseController>} controllers the login page
 * @param {[string,Object<string,string>]} [staticData] the static data
 */
// export const startApp = (mainComponent, defaultLoggedInPageName, loginPage, controllers, staticData) => {
export const startApp = (mainComponent, controllers) => {
    // if (staticData) this._staticDataService.createStoreModules(staticData);

    // this._authService.defaultLoggedInPageName = defaultLoggedInPageName;
    // this._authService.loginPage = loginPage;
    // this._authService.setRoutes();

    for (const controller in controllers) controllers[controller].init();

    const app = createApp(mainComponent);
    app.use(router);
    app.mount('#app');

    // this._eventService.app = createApp(mainComponent);
    // this._eventService.app.use(this._routerService.router);
    // this._eventService.app.mount('#app');

    // TODO :: could even do this first and .then(()=>this._authService.getLoggedInUser())
    // or make it a setting
    // if (this._authService.isLoggedin) this._authService.getLoggedInUser();
};

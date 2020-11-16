/**
 * @typedef {import('vue').Component} Component
 *
 * @typedef {import('../../types/types').Modules} Modules
 */

import {createApp} from 'vue';
import {router} from '../services/router';
// import {setDefaultLoggedInPageName} from '../services/auth';
// * @param {[string,Object<string,string>]} [staticData] the static data

/**
 * Start the app and set required settings
 *
 * @param {Component} mainComponent the main app component
 * @param {Modules} modules the login page
 * @param {string} defaultLoggedInPageName the page to go to when logged in
 * @param {Object} authComponents the page to go to when logged in
 */
export const startApp = (mainComponent, modules, defaultLoggedInPageName, authComponents) => {
    // setDefaultLoggedInPageName(defaultLoggedInPageName);
    // set auth pages
    // set auth routes

    // if (staticData) this._staticDataService.createStoreModules(staticData);

    for (const moduleName in modules) modules[moduleName].init();

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

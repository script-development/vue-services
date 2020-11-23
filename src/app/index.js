/**
 * @typedef {import('vue').Component} Component
 *
 * @typedef {import('../../types/types').Modules} Modules
 * @typedef {import('../../types/types').AuthComponents} AuthComponents
 */

import {createApp} from 'vue';
import {router} from '../services/router';
import {
    setAuthRoutes,
    setDefaultLoggedInPageName,
    setForgotPasswordPage,
    setLoginPage,
    setResetPasswordPage,
    setSetPasswordPage,
} from '../services/auth';
// * @param {[string,Object<string,string>]} [staticData] the static data

/**
 * Start the app.
 * Set required settings.
 * Init the modules.
 * Set the static data.
 *
 * @param {Component} mainComponent the main app component
 * @param {Modules} modules the login page
 * @param {string} defaultLoggedInPageName the page to go to when logged in
 * @param {AuthComponents} authComponents the page to go to when logged in
 */
export const startApp = (mainComponent, modules, defaultLoggedInPageName, authComponents) => {
    setDefaultLoggedInPageName(defaultLoggedInPageName);
    // set auth pages
    setLoginPage(authComponents.login);
    setResetPasswordPage(authComponents.resetPassword);
    if (authComponents.forgotPassword) setForgotPasswordPage(authComponents.forgotPassword);
    if (authComponents.setPassword) setSetPasswordPage(authComponents.setPassword);
    // set auth routes
    setAuthRoutes();

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

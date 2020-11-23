import {Component} from 'vue';
import {AuthComponents, Modules} from './types';

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
export function startApp(
    mainComponent: Component,
    modules: Modules,
    defaultLoggedInPageName: string,
    authComponents: AuthComponents
    // staticData?:
): void;

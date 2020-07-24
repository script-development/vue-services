import {Component} from 'vue';
import {RouterService} from './routerService';
import {EventService, AuthService} from './services';
import {PageCreator} from './creators';

export class AppStarter {
    _routerService: RouterService;
    _eventService: EventService;
    _authService: AuthService;
    _pageCreator: PageCreator;
    /**
     * Start the app and set required settings
     *
     * @param {Component} mainComponent the main app component
     * @param {String} defaultLoggedInPage the page to go to when logged in
     * @param {Component} loginPage the login page
     */
    start(mainComponent: Component, defaultLoggedInPage: string, loginPage: Component): void;
}

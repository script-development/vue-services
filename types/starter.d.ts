import {Component} from 'vue';
import {RouterService} from './routerService';
import {EventService, AuthService, StaticDataService} from './services';
import {BaseController} from './controllers';

export class AppStarter {
    _routerService: RouterService;
    _eventService: EventService;
    _authService: AuthService;
    _staticDataService: StaticDataService;
    _creatorInit: Function;
    /**
     * Start the app and set required settings
     *
     * @param {Component} mainComponent the main app component
     * @param {String} defaultLoggedInPage the page to go to when logged in
     * @param {Component} loginPage the login page
     * @param {Object<string,BaseController>} controllers the controllers used by the app
     * @param {[string,Object<string,string>]} [staticData] the static data
     */
    start(
        mainComponent: Component,
        defaultLoggedInPage: string,
        loginPage: Component,
        controllers: {[controllerName: string]: BaseController},
        staticData?: [string, {[key: string]: string}]
    ): void;
}

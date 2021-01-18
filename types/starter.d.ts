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
     */
    start(
        mainComponent: Component,
        defaultLoggedInPageName: string,
        loginPage: Component,
        controllers: {[controllerName: string]: BaseController},
        staticData?: readonly (string | {[key: string]: string})[]
    ): void;
}

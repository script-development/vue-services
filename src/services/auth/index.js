/**
 * @typedef {import('../router').RouterService} RouterService
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../storage').StorageService} StorageService
 * @typedef {import('../http').HTTPService} HTTPService
 * @typedef {import('vue').Component} Component
 * @typedef {import('vue-router').NavigationGuard} NavigationGuard
 */

import storeModule from './store';
import LoginPage from '../../pages/auth/Login';
import ForgotPasswordPage from '../../pages/auth/ForgotPassword';
import ResetPasswordPage from '../../pages/auth/ResetPassword';
import {MissingDefaultLoggedinPageError} from '../../errors/MissingDefaultLoggedinPageError';

const LOGIN_ACTION = 'login';
const LOGOUT_ACTION = 'logout';
const LOGIN_ROUTE_NAME = 'Login';

export class AuthService {
    /**
     * @param {RouterService} routerService
     * @param {StoreService} storeService
     * @param {StorageService} storageService
     * @param {HTTPService} httpService
     */
    constructor(routerService, storeService, storageService, httpService) {
        this._routerService = routerService;
        this._storeService = storeService;
        this._storageService = storageService;
        this._httpService = httpService;

        this._storeService.registerModule(this.storeModuleName, storeModule(storageService, httpService, this));

        this._defaultLoggedInPage;
        this._loginPage = LoginPage;

        this._httpService.registerResponseErrorMiddleware(this.responseErrorMiddleware);
        this._routerService.registerBeforeMiddleware(this.routeMiddleware);
    }

    // prettier-ignore
    get storeModuleName() {return 'auth'}

    get isLoggedin() {
        // TODO :: where to set isLoggedIn?
        return this._storeService.get(this.storeModuleName, 'isLoggedIn');
    }

    // TODO :: this is not basic usage, how to implement this?
    get isAdmin() {
        // TODO :: where to set isAdmin?
        return this._storeService.get(this.storeModuleName, 'isAdmin');
    }

    get defaultLoggedInPage() {
        if (!this._defaultLoggedInPage)
            throw new MissingDefaultLoggedinPageError(
                'Please set the default logged in page with authService.defaultLoggedInPage = "page"'
            );
        return this._defaultLoggedInPage;
    }

    // prettier-ignore
    /** @param {string} page */
    set defaultLoggedInPage(page){this._defaultLoggedInPage = page}

    // prettier-ignore
    get loginPage() {return this._loginPage}

    // prettier-ignore
    /** @param {Component} page*/
    set loginPage(page) {this._loginPage = page}

    /**
     * Login to the app
     * @param {Object} credentials the credentials to login with
     * @param {String} credentials.email the email to login with
     * @param {String} credentials.password the password to login with
     * @param {Boolean} credentials.rememberMe if you want a consistent login
     */
    login(credentials) {
        // TODO :: isAdmin should be something like role
        return this._storeService.dispatch(this.storeModuleName, LOGIN_ACTION, credentials).then(response => {
            // TODO :: check roles here somehow?
            // if (isAdmin) return this._routerService.goToRoute('courses.edit');
            this.goToStandardLoggedInPage();
            return response;
        });
    }

    logout() {
        return this._storeService.dispatch(this.storeModuleName, LOGOUT_ACTION);
    }

    sendEmailResetPassword(email) {
        return this._storeService.dispatch(this.storeModuleName, 'sendEmailResetPassword', email);
    }

    resetPassword(data) {
        return this._storeService.dispatch(this.storeModuleName, 'resetPassword', data);
    }

    goToStandardLoggedInPage() {
        this._routerService.goToRoute(this.defaultLoggedInPage);
    }

    goToLoginPage() {
        this._routerService.goToRoute(LOGIN_ROUTE_NAME);
    }

    get responseErrorMiddleware() {
        return ({response}) => {
            if (!response) return;
            const {status} = response;
            if (status == 403) {
                this.goToStandardLoggedInPage();
            } else if (status == 401) {
                this._storeService.dispatch(this.storeModuleName, 'logoutApp');
            }
        };
    }

    /** @returns {NavigationGuard} */
    get routeMiddleware() {
        return (to, from, next) => {
            const isLoggedIn = this.isLoggedin;
            // const isAdmin = this.isAdmin;

            if (isLoggedIn && !to.meta.auth) {
                this.goToStandardLoggedInPage();
                return true;
            }

            // if (!isAdmin && to.meta.admin) {
            //     this.goToStandardLoggedInPage();
            //     return true;
            // }

            if (!isLoggedIn && to.meta.auth) {
                this.goToLoginPage();
                return true;
            }

            return false;
        };
    }

    setRoutes() {
        const loginRoute = this._routerService._factory.createConfig(
            '/inloggen',
            LOGIN_ROUTE_NAME,
            this.loginPage,
            false,
            false,
            'Login'
        );

        const forgotPasswordRoute = this._routerService._factory.createConfig(
            '/wachtwoord-vergeten',
            'ForgotPassword',
            ForgotPasswordPage,
            false,
            false,
            'Wachtwoord vergeten'
        );

        const resetPasswordRoute = this._routerService._factory.createConfig(
            '/wachtwoord-resetten',
            'ResetPassword',
            ResetPasswordPage,
            false,
            false,
            'Wachtwoord resetten'
        );

        this._routerService.addRoutes([loginRoute, forgotPasswordRoute, resetPasswordRoute]);
    }
}

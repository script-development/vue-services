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

        this._defaultLoggedInPageName;
        this._loginPage = LoginPage;
        this._forgotPasswordPage = ForgotPasswordPage;
        this._resetPasswordPage = ResetPasswordPage;
        this._setPasswordPage;

        this._httpService.registerResponseErrorMiddleware(this.responseErrorMiddleware);
        this._routerService.registerBeforeMiddleware(this.routeMiddleware);

        // TODO :: this is standard behaviour for now, need to be able to adjust this
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

    get loggedInUser() {
        return this._storeService.get(this.storeModuleName, 'loggedInUser');
    }

    get defaultLoggedInPageName() {
        if (!this._defaultLoggedInPageName)
            throw new MissingDefaultLoggedinPageError(
                'Please set the default logged in page with authService.defaultLoggedInPageName = "page.name"'
            );
        return this._defaultLoggedInPageName;
    }

    // prettier-ignore
    /** @param {string} page */
    set defaultLoggedInPageName(page){this._defaultLoggedInPageName = page}

    // prettier-ignore
    get loginPage() {return this._loginPage}

    // prettier-ignore
    /** @param {Component} page*/
    set loginPage(page) {this._loginPage = page}

    // prettier-ignore
    get forgotPasswordPage() {return this._forgotPasswordPage}

    // prettier-ignore
    /** @param {Component} page*/
    set forgotPasswordPage(page) {this._forgotPasswordPage = page}

    // prettier-ignore
    get resetPasswordPage() {return this._resetPasswordPage}

    // prettier-ignore
    /** @param {Component} page*/
    set resetPasswordPage(page) {this._resetPasswordPage = page}

    // prettier-ignore
    get setPasswordPage() {return this._setPasswordPage}

    // prettier-ignore
    /** @param {Component} page*/
    set setPasswordPage(page) {this._setPasswordPage = page}

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
        this._routerService.goToRoute(this.defaultLoggedInPageName);
    }

    goToLoginPage() {
        this._routerService.goToRoute(LOGIN_ROUTE_NAME);
    }

    /**
     * Sends a request to the server to get the logged in user
     */
    getLoggedInUser() {
        this._storeService.dispatch(this.storeModuleName, 'me');
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
            const isAdmin = this.isAdmin;

            if (!isLoggedIn && to.meta.auth) {
                this.goToLoginPage();
                return true;
            }

            if (isLoggedIn && to.meta.cantSeeWhenLoggedIn) {
                this.goToStandardLoggedInPage();
                return true;
            }

            if (!isAdmin && to.meta.admin) {
                this.goToStandardLoggedInPage();
                return true;
            }

            return false;
        };
    }

    setRoutes() {
        const routes = [
            this._routerService._factory.createConfig(
                '/inloggen',
                LOGIN_ROUTE_NAME,
                this.loginPage,
                false,
                false,
                'Login',
                true
            ),
            this._routerService._factory.createConfig(
                '/wachtwoord-vergeten',
                'ForgotPassword',
                this.forgotPasswordPage,
                false,
                false,
                'Wachtwoord vergeten',
                true
            ),
            this._routerService._factory.createConfig(
                '/wachtwoord-resetten',
                'ResetPassword',
                this.resetPasswordPage,
                false,
                false,
                'Wachtwoord resetten',
                true
            ),
        ];

        if (this.setPasswordPage) {
            routes.push(
                this._routerService._factory.createConfig(
                    '/wachtwoord-setten',
                    'SetPassword',
                    this.setPasswordPage,
                    false,
                    false,
                    'Wachtwoord setten',
                    true
                )
            );
        }

        this._routerService.addRoutes(routes);
    }
}

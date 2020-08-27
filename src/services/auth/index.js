/**
 * @typedef {import('../router').RouterService} RouterService
 * @typedef {import('../router').BeforeMiddleware} BeforeMiddleware
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../storage').StorageService} StorageService
 * @typedef {import('../http').HTTPService} HTTPService
 * @typedef {import('../http').ResponseErrorMiddleware} ResponseErrorMiddleware

 * @typedef {import('vue').Component} Component
 *
 * @typedef {Object} Credentials
 * @property {String} email the email to login with
 * @property {String} password the password to login with
 * @property {Boolean} rememberMe if you want a consistent login
 *
 * @typedef {Object} ResetPasswordData
 * @property {String} password
 * @property {String} repeatPassword
 */

import storeModule from './store';
import LoginPage from '../../pages/auth/Login';
import ForgotPasswordPage from '../../pages/auth/ForgotPassword';
import ResetPasswordPage from '../../pages/auth/ResetPassword';
import {MissingDefaultLoggedinPageError} from '../../errors/MissingDefaultLoggedinPageError';

const LOGIN_ACTION = 'login';
const LOGOUT_ACTION = 'logout';

const LOGIN_ROUTE_NAME = 'Login';
const FORGOT_PASSWORD_ROUTE_NAME = 'ForgotPassword';
const RESET_PASSWORD_ROUTE_NAME = 'ResetPassword';
const SET_PASSWORD_ROUTE_NAME = 'SetPassword';

const STORE_MODULE_NAME = 'auth';

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

        this._storeService.registerModule(STORE_MODULE_NAME, storeModule(storageService, httpService, this));

        this._apiLoginRoute = '/login';
        this._apiLogoutRoute = '/logout';
        this._apiLoggedInCheckRoute = '/me';
        this._apiSendEmailResetPasswordRoute = '/send-email-reset-password';
        this._apiResetpasswordRoute = '/resetpassword';

        this._defaultLoggedInPageName;
        this._loginPage = LoginPage;
        this._forgotPasswordPage = ForgotPasswordPage;
        this._resetPasswordPage = ResetPasswordPage;
        this._setPasswordPage;

        this._httpService.registerResponseErrorMiddleware(this.responseErrorMiddleware);
        this._routerService.registerBeforeMiddleware(this.routeMiddleware);
    }

    get apiLoginRoute() {
        return this._apiLoginRoute;
    }

    set apiLoginRoute(route) {
        if (!route.startsWith('/')) route = '/' + route;
        this._apiLoginRoute = route;
    }

    get apiLogoutRoute() {
        return this._apiLogoutRoute;
    }

    set apiLogoutRoute(route) {
        if (!route.startsWith('/')) route = '/' + route;
        this._apiLogoutRoute = route;
    }

    get apiLoggedInCheckRoute() {
        return this._apiLoggedInCheckRoute;
    }

    set apiLoggedInCheckRoute(route) {
        if (!route.startsWith('/')) route = '/' + route;
        this._apiLoggedInCheckRoute = route;
    }

    get apiSendEmailResetPasswordRoute() {
        return this._apiSendEmailResetPasswordRoute;
    }

    set apiSendEmailResetPasswordRoute(route) {
        if (!route.startsWith('/')) route = '/' + route;
        this._apiSendEmailResetPasswordRoute = route;
    }

    get apiResetpasswordRoute() {
        return this._apiResetpasswordRoute;
    }

    set apiResetpasswordRoute(route) {
        if (!route.startsWith('/')) route = '/' + route;
        this._apiResetpasswordRoute = route;
    }

    get isLoggedin() {
        // TODO :: where to set isLoggedIn?
        return this._storeService.get(STORE_MODULE_NAME, 'isLoggedIn');
    }

    // TODO :: this is not basic usage, how to implement this?
    get isAdmin() {
        // TODO :: where to set isAdmin?
        return this._storeService.get(STORE_MODULE_NAME, 'isAdmin');
    }

    get loggedInUser() {
        return this._storeService.get(STORE_MODULE_NAME, 'loggedInUser');
    }

    get defaultLoggedInPageName() {
        if (!this._defaultLoggedInPageName)
            throw new MissingDefaultLoggedinPageError('Please add the default login page to the appStarter');
        return this._defaultLoggedInPageName;
    }

    // prettier-ignore
    /** @param {string} pageName */
    set defaultLoggedInPageName(pageName){this._defaultLoggedInPageName = pageName}

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
     * @param {Credentials} credentials the credentials to login with
     */
    login(credentials) {
        // TODO :: isAdmin should be something like role
        return this._storeService.dispatch(STORE_MODULE_NAME, LOGIN_ACTION, credentials).then(response => {
            // TODO :: check roles here somehow?
            // if (isAdmin) return this._routerService.goToRoute('courses.edit');
            this.goToStandardLoggedInPage();
            return response;
        });
    }

    logout() {
        return this._storeService.dispatch(STORE_MODULE_NAME, LOGOUT_ACTION);
    }

    /**
     * Send a reset password email to the given email
     * @param {String} email
     */
    sendEmailResetPassword(email) {
        return this._storeService.dispatch(STORE_MODULE_NAME, 'sendEmailResetPassword', email);
    }

    /**
     * @param {ResetPasswordData} data
     */
    resetPassword(data) {
        return this._storeService.dispatch(STORE_MODULE_NAME, 'resetPassword', data);
    }

    // prettier-ignore
    goToStandardLoggedInPage() { this._routerService.goToRoute(this.defaultLoggedInPageName); }

    // prettier-ignore
    goToLoginPage() { this._routerService.goToRoute(LOGIN_ROUTE_NAME); }

    // prettier-ignore
    goToForgotPasswordPage() { this._routerService.goToRoute(FORGOT_PASSWORD_ROUTE_NAME); }

    // prettier-ignore
    goToResetPasswordPage() { this._routerService.goToRoute(RESET_PASSWORD_ROUTE_NAME); }

    // prettier-ignore
    goToSetPasswordPage() { this._routerService.goToRoute(SET_PASSWORD_ROUTE_NAME); }

    /**
     * Sends a request to the server to get the logged in user
     */
    getLoggedInUser() {
        this._storeService.dispatch(STORE_MODULE_NAME, 'me');
    }

    /** @returns {ResponseErrorMiddleware} */
    get responseErrorMiddleware() {
        return ({response}) => {
            if (!response) return;
            const {status} = response;
            if (status == 403) {
                this.goToStandardLoggedInPage();
            } else if (status == 401) {
                this._storeService.dispatch(STORE_MODULE_NAME, 'logoutApp');
            }
        };
    }

    /** @returns {BeforeMiddleware} */
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
                FORGOT_PASSWORD_ROUTE_NAME,
                this.forgotPasswordPage,
                false,
                false,
                'Wachtwoord vergeten',
                true
            ),
            this._routerService._factory.createConfig(
                '/wachtwoord-resetten',
                RESET_PASSWORD_ROUTE_NAME,
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
                    SET_PASSWORD_ROUTE_NAME,
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

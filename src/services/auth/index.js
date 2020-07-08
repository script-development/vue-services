/**
 * @typedef {import('../router').RouterService} RouterService
 * @typedef {import('../store').StoreService} StoreService
 * @typedef {import('../storage').StorageService} StorageService
 * @typedef {import('../http').HTTPService} HTTPService
 */

import storeModule from './store';
import LoginPage from '../../pages/auth/Login';
import ForgotPasswordPage from '../../pages/auth/ForgotPassword';
import ResetPasswordPage from '../../pages/auth/ResetPassword';

// TODO :: is it a service or a controller?
export class AuthService {
    /**
     *
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

        const loginRoute = this._routerService._factory.createConfig(
            '/inloggen',
            'Login',
            LoginPage,
            false,
            false,
            'Login'
        );

        const forgotPasswordRoute = this._routerService._factory.createConfig(
            '/wachtwoordvergeten',
            'ForgotPassword',
            ForgotPasswordPage,
            false,
            false,
            'Wachtwoord vergeten'
        );

        const resetPasswordRoute = this._routerService._factory.createConfig(
            '/wachtwoordresetten',
            'ResetPassword',
            ResetPasswordPage,
            false,
            false,
            'Wachtwoord resetten'
        );

        this._routerService.addRoutes([loginRoute, forgotPasswordRoute, resetPasswordRoute]);

        this._httpService.registerResponseErrorMiddleware(this.responseErrorMiddleware);
        this._routerService.registerBeforeMiddleware(this.routeMiddleware);
    }

    // prettier-ignore
    get storeModuleName() {
        return 'auth'
    }

    get isLoggedin() {
        // TODO :: where to set isLoggedIn?
        return this._storeService.get(this.storeModuleName, 'isLoggedIn');
    }

    get isAdmin() {
        // TODO :: where to set isAdmin?
        return this._storeService.get(this.storeModuleName, 'isAdmin');
    }

    /**
     * Login to the app
     * @param {Object} credentials the credentials to login with
     * @param {String} credentials.email the email to login with
     * @param {String} credentials.password the password to login with
     * @param {Boolean} credentials.rememberMe if you want a consistent login
     */
    login(credentials) {
        // TODO :: where to set login as const?
        this._storeService.dispatch(this.storeModuleName, 'login', credentials).then(isAdmin => {
            // TODO :: where to get courses from?
            if (isAdmin) return this._routerService.goToRoute('courses.edit');
            this._routerService.goToRoute('courses.show');
        });
    }

    logout() {
        this._storeService.dispatch(this.storeModuleName, 'logout');
    }

    goToStandardLoggedInPage() {
        // TODO :: where to get courses from?
        this._routerService.goToRoute('courses.show');
    }

    sendEmailResetPassword(email) {
        this._storeService.dispatch(this.storeModuleName, 'sendEmailResetPassword', email);
    }

    resetPassword(data) {
        this._storeService.dispatch(this.storeModuleName, 'resetPassword', data);
    }

    goToLoginPage() {
        // TODO :: where to get Login from?
        this._routerService.goToRoute('Login');
    }

    get responseErrorMiddleware() {
        return ({response}) => {
            if (!response) return;
            const {status} = response;
            if (status == 403) {
                this.goToStandardLoggedInPage();
            } else if (status == 401) {
                this.logout();
            }
        };
    }

    get routeMiddleware() {
        return (to, from, next) => {
            const isLoggedIn = this.isLoggedin;
            const isAdmin = this.isAdmin;

            if (isLoggedIn && !to.meta.auth) {
                this.goToStandardLoggedInPage();
                return true;
            }

            if (!isAdmin && to.meta.admin) {
                this.goToStandardLoggedInPage();
                return true;
            }

            if (!isLoggedIn && to.meta.auth) {
                this.goToLoginPage();
                return true;
            }

            return false;
        };
    }
}

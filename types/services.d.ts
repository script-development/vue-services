import {AxiosResponse, AxiosRequestConfig, AxiosInstance, AxiosError} from 'axios';
import {Vue} from 'vue/types/vue';
import {RouterService, AfterMiddleware, BeforeMiddleware} from './routerService';
import {StoreService} from './storeService';

import {Component} from 'vue/types/index';
import {Item} from './controllers';

type Credentials = {email: string; password: string; rememberMe: boolean};
type RepeatPasswordData = {password: string; repeatPassword: string; [key: string]: string};

export class EventService {
    /**
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(httpService: HTTPService);
    _httpService: HTTPService;
    _app: Vue;

    set app(app: Vue);
    get app(): Vue;

    get responseMiddleware(): ResponseMiddleware;
    get responseErrorMiddleware(): ResponseErrorMiddleware;
    /**
     * pops up a toast with given message in the given variance
     * @param {String} message the message being shown by the toast
     * @param {String} variant the toast variant
     */
    toast(message: string, variant: string): void;
    /**
     * pops up a success toast
     * @param {String} message the message being shown by the toast
     */
    successToast(message: string): void;
    /**
     * pops up a danger toast
     * @param {String} message the message being shown by the toast
     */
    dangerToast(message: string): void;
    /**
     * pops up a modal with the given message
     * @param {String} message the message being shown by the modal
     * @param {Function} okAction the function being used when click on ok
     * @param {Function} [cancelAction] the being used when click on cancel
     */
    modal(message: string, okAction: Function, cancelAction?: Function): void;
}

type ErrorBag = {
    [property: string]: string[];
};

export class ErrorService {
    /**
     * @param {StoreService} storeService
     * @param {RouterService} routerService
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(storeService: StoreService, routerService: RouterService, httpService: HTTPService);
    _storeService: StoreService;
    _routerService: RouterService;
    _httpService: HTTPService;

    /**
     * Get all the known errors
     * @returns {ErrorBag}
     */
    getErrors(): ErrorBag;
    /**
     * Store the given errors, overriding every known error
     *
     * @param {ErrorBag} errors
     */
    setErrors(errors: ErrorBag): void;
    /** Clear every known error */
    destroyErrors(): void;

    /** @returns {ResponseErrorMiddleware} */
    get responseErrorMiddleware(): ResponseErrorMiddleware;
    /** @returns {AfterMiddleware} */
    get routeMiddleware(): AfterMiddleware;
}

export class AuthService {
    /**
     * @param {RouterService} routerService
     * @param {StoreService} storeService
     * @param {StorageService} storageService
     * @param {HTTPService} httpService
     */
    constructor(
        routerService: RouterService,
        storeService: StoreService,
        storageService: StorageService,
        httpService: HTTPService
    );
    _routerService: RouterService;
    _storeService: StoreService;
    _storageService: StorageService;
    _httpService: HTTPService;

    _loginPage: Component;
    _forgotPasswordPage: Component;
    _resetPasswordPage: Component;
    _setPasswordPage: Component;

    _defaultLoggedInPage: string;

    _apiLoginRoute: string;
    _apiLogoutRoute: string;
    _apiLoggedInCheckRoute: string;
    _apiSendEmailResetPasswordRoute: string;
    _apiResetpasswordRoute: string;

    get apiLoginRoute(): string;
    set apiLoginRoute(route: string);

    get apiLogoutRoute(): string;
    set apiLogoutRoute(route: string);

    get apiLoggedInCheckRoute(): string;
    set apiLoggedInCheckRoute(route: string);

    get apiSendEmailResetPasswordRoute(): string;
    set apiSendEmailResetPasswordRoute(route: string);

    get apiResetpasswordRoute(): string;
    set apiResetpasswordRoute(route: string);

    get isLoggedin(): boolean;
    get isAdmin(): boolean;
    get loggedInUser(): {[key: string]: any};
    /** @param {string} pageName */
    set defaultLoggedInPageName(pageName: string);
    get defaultLoggedInPageName(): string;
    /** @param {Component} page*/
    set loginPage(page: Component);
    get loginPage(): Component;
    /** @param {Component} page*/
    set forgotPasswordPage(page: Component);
    get forgotPasswordPage(): Component;
    /** @param {Component} page*/
    set resetPasswordPage(page: Component);
    get resetPasswordPage(): Component;
    /** @param {Component} page*/
    set setPasswordPage(page: Component);
    get setPasswordPage(): Component;
    /**
     * Login to the app
     * @param {Credentials} credentials the credentials to login with
     */
    login(credentials: Credentials): Promise<AxiosResponse>;
    logout(): Promise<AxiosResponse>;
    goToStandardLoggedInPage(): void;
    sendEmailResetPassword(email: string): Promise<AxiosResponse>;
    resetPassword(data: RepeatPasswordData): Promise<AxiosResponse>;
    goToLoginPage(): void;
    /**
     * Sends a request to the server to get the logged in user
     */
    getLoggedInUser(): void;
    goToForgotPasswordPage(): void;
    goToResetPasswordPage(): void;
    goToSetPasswordPage(): void;

    get responseErrorMiddleware(): ResponseErrorMiddleware;
    get routeMiddleware(): BeforeMiddleware;
    setRoutes(): void;
}

export const MSG_PACK_DATA_TYPE = 'msg-pack';

type StaticDataTypes = [string | {[moduleName: string]: typeof MSG_PACK_DATA_TYPE}];

export class StaticDataService {
    /**
     * @param {StoreService} storeService
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(storeService: StoreService, httpService: HTTPService);
    _storeService: StoreService;
    _httpService: HTTPService;
    _data: {normal: string[]; msgpack: string[]};

    /**
     * initiates the setup for the default store modules
     *
     * @param {[string,Object<string,string>]} data Modulenames
     */
    createStoreModules(data: StaticDataTypes): void;

    /**
     * Creates and registers modules for the staticdata
     *
     * @param {string} storeModuleName Modulenames
     */
    createStoreModule(storeModuleName: string): void;

    /**
     * Create module for static data with msg-pack lite(peerDependencies)
     *
     * @param {string} storeModuleName Modulenames
     */
    createStoreModuleMsgPack(storeModuleName: string): void;

    /**
     * Sends an action to the store which reads all the staticdata from the server
     */
    getStaticData(): void;

    /**
     * Retrieves all entries from the specific data source
     *
     * @param {string} data
     */
    getAll(data: string): Item[];

    /**
     * Retrieves a single row(by ID) from the specific data source
     *
     * @param {String} data
     * @param {Number} id
     */
    getById(data: string, id: number): Item;
}

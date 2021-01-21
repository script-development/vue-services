import {AxiosResponse, AxiosRequestConfig, AxiosInstance, AxiosError} from 'axios';
import {Vue} from 'vue/types/vue';
import {RouterService, AfterMiddleware, BeforeMiddleware} from './routerService';
import {StoreService} from './storeService';

import {Component} from 'vue/types/index';
import {Item} from './controllers';

export type Translation = {
    /**
     * the singular translation
     */
    singular: string;
    /**
     * the plural translation
     */
    plural: string;
};

type Cache = {[key: string]: number};

type Credentials = {email: string; password: string; rememberMe: boolean};
type RepeatPasswordData = {password: string; repeatPassword: string; [key: string]: string};

export type RequestMiddleware = (request: AxiosRequestConfig) => void;
export type ResponseMiddleware = (response: AxiosResponse) => void;
export type ResponseErrorMiddleware = (error: AxiosError) => void;

export class HTTPService {
    _storageService: StorageService;
    _cache: Cache;
    _cahceDuration: number;
    _http: AxiosInstance;
    _requestMiddleware: RequestMiddleware[];
    _responseMiddleware: ResponseMiddleware[];
    _responseErrorMiddleware: ResponseErrorMiddleware[];

    get cacheDuration(): number;
    set cacheDuration(value: number);
    /**
     * send a get request to the given endpoint
     * @param {String} endpoint the endpoint for the get
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    get(endpoint: string, options?: AxiosRequestConfig): Promise<AxiosResponse>;
    /**
     * send a post request to the given endpoint with the given data
     * @param {String} endpoint the endpoint for the post
     * @param {any} data the data to be send to the server
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    post(endpoint: string, data: any, options?: AxiosRequestConfig): Promise<AxiosResponse>;
    /**
     * send a delete request to the given endpoint
     * @param {String} endpoint the endpoint for the get
     */
    delete(endpoint: string): Promise<AxiosResponse>;
    /**
     * download a file from the backend
     * type should be resolved automagically, if not, then you can pass the type
     * @param {String} endpoint the endpoint for the download
     * @param {String} documentName the name of the document to be downloaded
     * @param {String} [type] the downloaded document type
     */
    download(endpoint: string, documentName: string, type?: string): Promise<AxiosResponse>;
    registerRequestMiddleware(middlewareFunc: any): void;
    registerResponseMiddleware(middlewareFunc: any): void;
    registerResponseErrorMiddleware(middlewareFunc: any): void;
}

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

export const PLURAL = 'plural';
export const SINGULAR = 'singular';

export class TranslatorService {
    /** @type {Object.<string, Translation>}*/
    private _translations: {
        [key: string]: Translation;
    };
    /**
     * Get plural or singular translation for given value
     *
     * @param {String} value
     * @param {PLURAL | SINGULAR} pluralOrSingular
     *
     * @throws {MissingTranslationError}
     *
     * @private
     */
    private _getTranslation(value: string, pluralOrSingular: typeof PLURAL | typeof SINGULAR): string;
    /**
     * Get the plural translation for the given value
     *
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    getPlural(value: string): string;
    /**
     * Get the singular translation for the given value
     *
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    getSingular(value: string): string;
    /**
     * Get the singular translation for the given value and capitalize it
     *
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    getCapitalizedSingular(value: string): string;
    /**
     * Get the plural translation for the given value and capitalize it
     *
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    getCapitalizedPlural(value: string): string;
    /**
     * Get the either the singular or plural translation, based on the given count
     * Return the string `${count} ${translation}`
     *
     * @param {Number} count
     * @param {String} value
     *
     * @throws {MissingTranslationError}
     */
    maybePluralize(count: number, value: string): string;
    /**
     * @param {string} key
     * @param {Translation} translation
     */
    setTranslation(key: string, translation: Translation): void;
}

export class StorageService {
    /** @param {Boolean} value */
    set keepALive(value: Boolean);
    get keepALive(): Boolean;
    /**
     * Set the given value in the storage under the given key
     * If the value is not of type String, it will be converted to String
     *
     * @param {String} key
     * @param {String | any} value
     */
    setItem(key: string, value: string | any): void;
    /**
     * Get the value from the storage under the given key
     *
     * @param {String} key
     * @param {Boolean} [parse] if parse is given, then JSON.parse will be used to return a parsed value
     */
    getItem(key: string, parse: boolean): any;
    /**
     * Empty the storage
     */
    clear(): void;
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
export class LoadingService {
    /**
     * @param {StoreService} storeService
     * @param {HTTPService} httpService
     */
    constructor(storeService: StoreService, httpService: HTTPService);
    _storeModuleName: string;
    _storeService: StoreService;

    spinnerTimeout: number;
    minTimeSpinner: number;
    loadingTimeStart: number;
    loadingTimeoutId: NodeJS.Timeout;
    /**
     * Set the loading state
     *
     * @param {Boolean} loading the loading state
     */
    set loading(loading: boolean);
    /**
     * get the loading state
     *
     * @returns {Boolean}
     */
    get loading(): boolean;
    /** @returns {RequestMiddleware} */
    get requestMiddleware(): RequestMiddleware;
    /** @returns {ResponseMiddleware | ResponseErrorMiddleware} */
    get responseMiddleware(): ResponseMiddleware | ResponseErrorMiddleware;
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

import {AxiosResponse, AxiosRequestConfig, AxiosInstance} from 'axios';
import {Vue} from 'vue/types/vue';
import {RouterService} from './routerService';
import {StoreService} from './storeService';

import {Component, CreateElement, VNode} from 'vue/types/index';
import {DefaultData, DefaultMethods, DefaultComputed} from 'vue/types/options';

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

export class HTTPService {
    _http: AxiosInstance;
    _requestMiddleware: any[];
    _responseMiddleware: any[];
    _responseErrorMiddleware: any[];
    /**
     * send a get request to the given endpoint
     * @param {String} endpoint the endpoint for the get
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    get(endpoint: string, options?: AxiosRequestConfig): Promise<AxiosResponse>;
    /**
     * send a post request to the given endpoint with the given data
     * @param {String} endpoint the endpoint for the post
     * @param {Object.<string,*>} data the data to be send to the server
     */
    post(
        endpoint: string,
        data: {
            [x: string]: any;
        }
    ): Promise<AxiosResponse>;
    /**
     * send a delete request to the given endpoint
     * @param {String} endpoint the endpoint for the get
     */
    delete(endpoint: string): Promise<AxiosResponse>;
    registerRequestMiddleware(middlewareFunc: any): void;
    registerResponseMiddleware(middlewareFunc: any): void;
    registerResponseErrorMiddleware(middlewareFunc: any): void;
}

export class EventService {
    /**
     *
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(httpService: HTTPService);
    _httpService: HTTPService;
    set app(arg: Vue);
    get app(): Vue;
    _app: Vue;
    get responseMiddleware(): ({data}: {data: any}) => void;
    get responseErrorMiddleware(): ({response}: {response: any}) => void;
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

export class TranslatorService {
    /** @type {Object.<string, Translation>}*/
    _translations: {
        [x: string]: Translation;
    };
    getTranslation(value: any, pluralOrSingular: any): any;
    getPlural(value: any): any;
    getSingular(value: any): any;
    getCapitalizedSingular(value: any): string;
    getCapitalizedPlural(value: any): string;
    maybePluralize(count: any, value: any): string;
    /**
     * @param {string} key
     * @param {Translation} translation
     */
    setTranslation(key: string, translation: Translation): void;
}

export class StorageService {
    set keepALive(arg: any);
    get keepALive(): any;
    setItem(key: any, value: any, size: any): void;
    getItem(key: any): string;
    clear(): void;
}
export class ErrorService {
    /**
     * @param {StoreService} storeService
     * @param {RouterService} routerService
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(storeService: StoreService, routerService: RouterService, httpService: HTTPService);
    _storeModuleName: string;
    _storeService: StoreService;
    _routerService: RouterService;
    _httpService: HTTPService;
    getErrors(): any;
    setErrors(errors: any): void;
    destroyErrors(): void;
    get responseErrorMiddleware(): ({response}: {response: any}) => void;
    get routeMiddleware(): (to: any, from: any) => void;
}
export class LoadingService {
    /**
     * @param {StoreService} storeService
     * @param {HTTPService} httpService
     */
    constructor(storeService: StoreService, httpService: HTTPService);
    _storeModuleName: string;
    _storeService: StoreService;
    /**
     * Set the loading state
     *
     * @param {Boolean} loading the loading state
     */
    set loading(arg: boolean);
    /**
     * get the loading state
     *
     * @returns {Boolean}
     */
    get loading(): boolean;
    spinnerTimeout: number;
    minTimeSpinner: number;
    loadingTimeStart: number;
    loadingTimeoutId: NodeJS.Timeout;
    get requestMiddleware(): () => boolean;
    get responseMiddleware(): () => boolean;
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
    _loginPage: {
        render(h: any): void;
    };
    get storeModuleName(): string;
    get isLoggedin(): boolean;
    /** @param {string} page */
    set defaultLoggedInPage(arg: string);
    get defaultLoggedInPage(): string;
    _defaultLoggedInPage: string;
    /** @param {Component} page*/
    set loginPage(arg: Component<DefaultData<never>, DefaultMethods<never>, DefaultComputed, Record<string, any>>);
    get loginPage(): Component<DefaultData<never>, DefaultMethods<never>, DefaultComputed, Record<string, any>>;
    /**
     * Login to the app
     * @param {Object} credentials the credentials to login with
     * @param {String} credentials.email the email to login with
     * @param {String} credentials.password the password to login with
     * @param {Boolean} credentials.rememberMe if you want a consistent login
     */
    login(credentials: {email: string; password: string; rememberMe: boolean}): Promise<AxiosResponse>;
    logout(): Promise<AxiosResponse>;
    goToStandardLoggedInPage(): void;
    sendEmailResetPassword(email: any): Promise<AxiosResponse>;
    resetPassword(data: any): Promise<AxiosResponse>;
    goToLoginPage(): void;
    get responseErrorMiddleware(): ({response}: {response: any}) => void;
    get routeMiddleware(): (to: any, from: any, next: any) => boolean;
    setRoutes(): void;
}

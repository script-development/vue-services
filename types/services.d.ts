import {Vue} from 'vue/types/vue';
import {StoreService} from './storeService';

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

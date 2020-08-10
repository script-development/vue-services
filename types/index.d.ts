import {AppStarter} from './starter';

import {
    HTTPService,
    EventService,
    TranslatorService,
    AuthService,
    ErrorService,
    LoadingService,
    StaticDataService,
} from './services';

import {RouterService} from './routerService';
import {StoreService} from './storeService';

export {BaseController} from './controllers';
export {Translation} from './services';

export {PageCreator, TableCreator} from './creators';

export const appStarter: AppStarter;

export const authService: AuthService;
export const routerService: RouterService;
export const storeService: StoreService;
export const errorService: ErrorService;
export const loadingService: LoadingService;
export const httpService: HTTPService;
export const eventService: EventService;
export const translatorService: TranslatorService;
export const staticDataService: StaticDataService;

export {HTTPService, EventService, TranslatorService, AuthService, ErrorService, LoadingService, StaticDataService};

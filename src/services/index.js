import {StorageService} from './storage';
const storageService = new StorageService();

import {HTTPService} from './http';
export const httpService = new HTTPService(storageService);

import {EventService} from './event';
export const eventService = new EventService(httpService);

import {TranslatorService} from './translator';
export const translatorService = new TranslatorService();

import {RouterService} from './router';
import {RouteFactory} from './router/factory';
import {RouteSettings} from './router/settings';

const routeFactory = new RouteFactory();
const routeSettings = new RouteSettings(translatorService);
export const routerService = new RouterService(routeFactory, routeSettings);

import {StoreModuleFactory} from './store/factory';
import {StoreService} from './store';

const storeFactory = new StoreModuleFactory(httpService, storageService);
export const storeService = new StoreService(storeFactory, httpService);

// import {ErrorService} from './error';
// export const errorService = new ErrorService(storeService, routerService, httpService);

// import {LoadingService} from './loading';
// export const loadingService = new LoadingService(storeService, httpService);

import {StaticDataService} from './staticdata';
export const staticDataService = new StaticDataService(storeService, httpService);

import {AuthService} from './auth';

export const authService = new AuthService(routerService, storeService, storageService, httpService);

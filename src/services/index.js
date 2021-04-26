import { StorageService } from './storage/index';
const storageService = new StorageService();

import { HTTPService } from './http/index';
export const httpService = new HTTPService(storageService);

import { EventService } from './event/index';
export const eventService = new EventService(httpService);

import { TranslatorService } from './translator/index';
export const translatorService = new TranslatorService();

import { RouterService } from './router/index';
import { RouteFactory } from './router/factory/index';
import { RouteSettings } from './router/settings/index';

const routeFactory = new RouteFactory();
const routeSettings = new RouteSettings(translatorService);
export const routerService = new RouterService(routeFactory, routeSettings);

import { StoreModuleFactory } from './store/factory/index';
import { StoreService } from './store/index';

const storeFactory = new StoreModuleFactory(httpService, storageService);
export const storeService = new StoreService(storeFactory, httpService);

import { ErrorService } from './error/index';
export const errorService = new ErrorService(storeService, routerService, httpService);

import { LoadingService } from './loading/index';
export const loadingService = new LoadingService(storeService, httpService);

import { StaticDataService } from './staticdata/index';
export const staticDataService = new StaticDataService(storeService, httpService);

import { AuthService } from './auth/index';

export const authService = new AuthService(routerService, storeService, storageService, httpService);

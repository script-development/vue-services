import {
    routerService,
    storeService,
    errorService,
    loadingService,
    authService,
    httpService,
    eventService,
    translatorService,
    staticDataService,
} from './services';

import {tableCreator, pageCreator} from './creators';

import {AppStarter} from './app';

const appStarter = new AppStarter(routerService, eventService, authService, staticDataService);

export {
    routerService,
    storeService,
    errorService,
    loadingService,
    authService,
    httpService,
    eventService,
    translatorService,
    staticDataService,
    tableCreator,
    pageCreator,
    appStarter,
};

export {BaseController} from './controllers';

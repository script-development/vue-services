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

import {formCreator, buttonCreator, pageCreator} from './creators';

import {AppStarter} from './app';

const appStarter = new AppStarter(routerService, eventService, authService, staticDataService, pageCreator);

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
    formCreator,
    buttonCreator,
    pageCreator,
    appStarter,
};

export {BaseController} from './controllers';

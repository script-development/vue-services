import {
    routerService,
    storeService,
    errorService,
    loadingService,
    authService,
    httpService,
    eventService,
    translatorService,
} from './services';

import {formCreator, buttonCreator, pageCreator} from './creators';

import {AppStarter} from './app';

const appStarter = new AppStarter(routerService, eventService, authService, pageCreator);

export {
    routerService,
    storeService,
    errorService,
    loadingService,
    authService,
    httpService,
    eventService,
    translatorService,
    formCreator,
    buttonCreator,
    pageCreator,
    appStarter,
};

export {BaseController} from './controllers';

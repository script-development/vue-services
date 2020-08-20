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

export {tableCreator, pageCreator, detailListCreator} from './creators';

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
    appStarter,
};

export {BaseController} from './controllers';

export {
    routerService,
    storeService,
    errorService,
    loadingService,
    authService,
    httpService,
    eventService,
    translatorService,
} from './services';

export {formCreator, buttonCreator, pageCreator} from './creators';

export {BaseController} from './controllers';

import {AppStarter} from './app';

export const appStarter = new AppStarter(routerService, eventService, authService, pageCreator);

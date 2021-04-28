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
} from './services/index';

export {
    baseCreator,
    formCreator,
    tableCreator,
    detailListCreator,
    overviewPageCreator,
    createPageCreator,
    showPageCreator,
    editPageCreator,
} from './creators/index';

import { AppStarter } from './app/index';

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

export { BaseController } from './controllers/index';

import MinimalRouterView from './components/MinimalRouterView';
export { MinimalRouterView };

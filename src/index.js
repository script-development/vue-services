import {
    // storeService,
    // errorService,
    // loadingService,
    // httpService,
    // translatorService,
    routerService,
    authService,
    eventService,
    staticDataService,
} from './services';

// export {
//     baseCreator,
//     formCreator,
//     tableCreator,
//     detailListCreator,
//     overviewPageCreator,
//     createPageCreator,
//     showPageCreator,
//     editPageCreator,
// } from './creators';

import {AppStarter} from './app';

const appStarter = new AppStarter(routerService, eventService, authService, staticDataService);

export {
    // storeService,
    // errorService,
    // loadingService,
    // httpService,
    // translatorService,
    routerService,
    authService,
    eventService,
    staticDataService,
    appStarter,
};

// export {BaseController} from './controllers';

// import MinimalRouterView from './components/MinimalRouterView';
// export {MinimalRouterView};

// The same as ./types/index.d.ts
export {startApp} from './app';

export {moduleFactory, MinimalRouterView} from './module';

export {login, isLoggedIn, logout} from './services/auth';

export {createToastMessage, createModal} from './services/event';

export {BaseFormError} from './services/error';

export {getRequest, postRequest, download} from './services/http';

export {
    addRoute,
    goToRoute,
    getCurrentRouteQuery,
    getCurrentRouteModuleName,
    getCurrentRouteId,
    hasShowPage,
    hasCreatePage,
    hasEditPage,
    goToShowPage,
    goToCreatePage,
    goToEditPage,
} from './services/router';

export {getAllFromStore, getByIdFromStore} from './services/store';

export {
    getPluralTranslation,
    getCapitalizedPluralTranslation,
    getCapitalizedSingularTranslation,
    getSingularTranslation,
} from './services/translator';

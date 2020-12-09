// The same as ./types/index.d.ts
export {startApp} from './app';

export {moduleFactory} from './module';

export {login, isLoggedIn, logout} from './services/auth';

export {createToastMessage, createModal} from './services/event';

export {BaseFormError} from './services/error';

export {getRequest, postRequest, download} from './services/http';

export {addRoute, goToRoute} from './services/router';

export {getAllFromStore} from './services/store';

export {
    getPluralTranslation,
    getCapitalizedPluralTranslation,
    getCapitalizedSingularTranslation,
    getSingularTranslation,
} from './services/translator';

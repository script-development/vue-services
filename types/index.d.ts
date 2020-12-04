// The same as ./src/index.js
export {startApp} from './starter';

export {moduleFactory} from './module';

export {login, isLoggedIn, logout} from './services/auth';

// export {createToastMessage, createModal} from './services/event';

export {BaseFormError} from './services/error';

export {getRequest, postRequest, download} from './services/http';

export {addRoute} from './services/router';

export {
    getPluralTranslation,
    getCapitalizedPluralTranslation,
    getCapitalizedSingularTranslation,
    getSingularTranslation,
} from './services/translator';

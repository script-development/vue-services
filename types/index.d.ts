export const routerService: import('../src/services/router').RouterService;
export const storeService: import('../src/services/store').StoreService;
export const errorService: import('../src/services/error').ErrorService;
export const loadingService: import('../src/services/loading').LoadingService;
export const authService: import('../src/services/auth').AuthService;
export const httpService: import('../src/services/http').HTTPService;
export const eventService: import('../src/services/event').EventService;
export const pageCreatorService: import('../src/services/pageCreator').PageCreatorService;
export const translatorService: import('../src/services/translator').TranslatorService;
export {BaseController} from './controllers';

// TODO :: move to errors
// export class MissingTranslationError extends Error {
//     constructor(...params: any[]);
// }

// export class MissingDefaultLoggedinPageError extends Error {
//     constructor(...params: any[]);
// }

// import {
//     HTTPService,
//     EventService,
//     TranslatorService,
//     AuthService,
//     ErrorService,
//     LoadingService,
//     PageCreatorService,
// } from './services';

// import {RouterService} from './routerService';

// import {StoreService} from './storeService';

// export const authService: AuthService;
// export const routerService: RouterService;
// export const storeService: StoreService;
// export const errorService: ErrorService;
// export const loadingService: LoadingService;
// export const httpService: HTTPService;
// export const eventService: EventService;
// export const pageCreatorService: PageCreatorService;
// export const translatorService: TranslatorService;

import {AppStarter} from './starter';

import {
    HTTPService,
    EventService,
    TranslatorService,
    AuthService,
    ErrorService,
    LoadingService,
    StaticDataService,
} from './services';

import {RouterService} from './routerService';
import {StoreService} from './storeService';

export {BaseController, Item} from './controllers';
export {Translation} from './services';

import {
    BaseCreator,
    TableCreator,
    CreatePageCreator,
    DetailListCreator,
    FormCreator,
    OverviewPageCreator,
    ShowPageCreator,
    EditPageCreator,
} from './creators';

export const baseCreator: BaseCreator;
export const tableCreator: TableCreator;
export const createPageCreator: CreatePageCreator;
export const detailListCreator: DetailListCreator;
export const formCreator: FormCreator;
export const overviewPageCreator: OverviewPageCreator;
export const showPageCreator: ShowPageCreator;
export const editPageCreator: EditPageCreator;

export const appStarter: AppStarter;

export const authService: AuthService;
export const routerService: RouterService;
export const storeService: StoreService;
export const errorService: ErrorService;
export const loadingService: LoadingService;
export const httpService: HTTPService;
export const eventService: EventService;
export const translatorService: TranslatorService;
export const staticDataService: StaticDataService;

export {HTTPService, EventService, TranslatorService, AuthService, ErrorService, LoadingService, StaticDataService};

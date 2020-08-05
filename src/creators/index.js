/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

import {errorService, translatorService, eventService, routerService} from '../services';

import {PageCreator} from './pages';
import {TableCreator} from './tables';

export const pageCreator = new PageCreator(errorService, translatorService, eventService, routerService);
export const tableCreator = new TableCreator(translatorService);

/** @param {CreateElement} h */
export const init = h => {
    pageCreator.h = h;
    tableCreator.h = h;
};

// import {ButtonCreator} from './buttons';
// import {FormCreator} from './forms';
// export const buttonCreator = new ButtonCreator();
// export const formCreator = new FormCreator(buttonCreator);

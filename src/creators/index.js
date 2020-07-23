/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

import {errorService, translatorService, eventService, routerService} from '../services';

import {PageCreator} from './pages';
import {ButtonCreator} from './buttons';
import {FormCreator} from './forms';

export const pageCreator = new PageCreator(errorService, translatorService, eventService, routerService);
export const buttonCreator = new ButtonCreator();
export const formCreator = new FormCreator(buttonCreator);

/**
 * Init the creators, which attaches the CreateElement function to the creators
 * TODO :: Vue3, remove this and import h from Vue
 *
 * @param {CreateElement} h
 */
export const init = h => {
    pageCreator.init(h);
    buttonCreator.init(h);
    formCreator.init(h);
};

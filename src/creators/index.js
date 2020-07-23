/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

import {errorService, translatorService, eventService, routerService} from '../services';

import {PageCreator} from './pages';
import {ButtonCreator} from './buttons';
import {FormCreator} from './forms';

export const buttonCreator = new ButtonCreator();
export const formCreator = new FormCreator(buttonCreator);

export const pageCreator = new PageCreator(errorService, translatorService, eventService, routerService);

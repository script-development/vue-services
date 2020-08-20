/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

import {errorService, translatorService, eventService, routerService} from '../services';

import {PageCreator} from './page';
import {TableCreator} from './table';
import {FormCreator} from './form';
import {DetailListCreator} from './detailList';

import Vue from 'vue';

export const pageCreator = new PageCreator(errorService, translatorService, eventService, routerService);
export const tableCreator = new TableCreator(translatorService);
export const formCreator = new FormCreator(translatorService);
export const detailListCreator = new DetailListCreator();

// Very cheesy way to bind CreateElement to the creators

new Vue({
    el: document.createElement('div'),
    render(h) {
        pageCreator.h = h;
        tableCreator.h = h;
        formCreator.h = h;
        detailListCreator.h = h;
        return h('div');
    },
});

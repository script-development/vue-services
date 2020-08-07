/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

import {errorService, translatorService, eventService, routerService} from '../services';

import {PageCreator} from './pages';
import {TableCreator} from './tables';

import Vue from 'vue';

export const pageCreator = new PageCreator(errorService, translatorService, eventService, routerService);
export const tableCreator = new TableCreator(translatorService);

// Very cheesy way to bind CreateElement to the creators

new Vue({
    el: document.createElement('div'),
    render(h) {
        pageCreator.h = h;
        tableCreator.h = h;
        return h('div');
    },
});

// import {ButtonCreator} from './buttons';
// import {FormCreator} from './forms';
// export const buttonCreator = new ButtonCreator();
// export const formCreator = new FormCreator(buttonCreator);

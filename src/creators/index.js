/**
 * @typedef {import('vue').CreateElement} CreateElement
 */

import Vue from 'vue';
import { errorService, translatorService, routerService } from '../services/index';

import { BaseCreator } from './basecreator';

import { CreatePageCreator } from './createpagecreator';
import { EditPageCreator } from './editpagecreator';
import { OverviewPageCreator } from './overviewpagecreator';
import { ShowPageCreator } from './showpagecreator';

import { TableCreator } from './table';
import { FormCreator } from './form';
import { DetailListCreator } from './detailList';

export const baseCreator = new BaseCreator(translatorService);

export const createPageCreator = new CreatePageCreator(baseCreator, errorService, translatorService, routerService);
export const editPageCreator = new EditPageCreator(baseCreator, errorService, translatorService, routerService);
export const overviewPageCreator = new OverviewPageCreator(baseCreator, translatorService);
export const showPageCreator = new ShowPageCreator(baseCreator, translatorService);

export const tableCreator = new TableCreator(baseCreator, translatorService);
export const formCreator = new FormCreator(baseCreator, translatorService);
export const detailListCreator = new DetailListCreator(baseCreator);

// Very cheesy way to bind CreateElement to the creators

new Vue({
    el: document.createElement('div'),
    render(h) {
        baseCreator.h = h;
        createPageCreator.h = h;
        editPageCreator.h = h;
        overviewPageCreator.h = h;
        showPageCreator.h = h;
        tableCreator.h = h;
        formCreator.h = h;
        detailListCreator.h = h;
        return h('div');
    },
});

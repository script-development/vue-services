/**
 * @typedef {import('vue').Component} Component
 * @typedef {import('vue-router').RouteRecordRaw} RouteRecordRaw
 */

import {
    getPluralTranslation,
    getCapitalizedSingularTranslation,
    getCapitalizedPluralTranslation,
} from '../../translator';

export const CREATE_PAGE_NAME = '.create';
export const EDIT_PAGE_NAME = '.edit';
export const OVERVIEW_PAGE_NAME = '.overview';
export const SHOW_PAGE_NAME = '.show';

const CREATE = 'create';
const EDIT = 'edit';
const OVERVIEW = 'overview';
const SHOW = 'show';

const nameConversion = {
    [CREATE]: CREATE_PAGE_NAME,
    [EDIT]: EDIT_PAGE_NAME,
    [OVERVIEW]: OVERVIEW_PAGE_NAME,
    [SHOW]: SHOW_PAGE_NAME,
};

const titleConversion = {
    [CREATE]: ' aanmaken',
    [EDIT]: ' aanpassen',
    [OVERVIEW]: ' overzicht',
    [SHOW]: ' bekijken',
};

const pathConversion = {
    [CREATE]: 'toevoegen',
    [EDIT]: ':id/aanpassen',
    [OVERVIEW]: '',
    [SHOW]: ':id',
};

const translationConversion = {
    [CREATE]: getCapitalizedSingularTranslation,
    [EDIT]: getCapitalizedSingularTranslation,
    [OVERVIEW]: getCapitalizedPluralTranslation,
    [SHOW]: getCapitalizedSingularTranslation,
};

/**
 *
 * @param {string} moduleName
 * @param {CREATE | EDIT | OVERVIEW | SHOW} part
 * @param {Component} component
 *
 * @returns {RouteRecordRaw}
 */
const partialFactory = (moduleName, part, component) => {
    return {
        name: moduleName + nameConversion[part],
        path: pathConversion[part],
        component,
        meta: {
            auth: true,
            title: translationConversion[part] + titleConversion[part],
        },
        children: undefined,
    };
};

/**
 * Creates standard route settings.
 * Creates settings for the optional routes when the components are given.
 * Does not add the optional routes otherwise
 *
 * @param {string} moduleName
 * @param {Component} baseComponent
 * @param {Component} [overviewComponent]
 * @param {Component} [createComponent]
 * @param {Component} [editComponent]
 * @param {Component} [showComponent]
 */
export default (moduleName, baseComponent, overviewComponent, createComponent, editComponent, showComponent) => {
    const routeSettings = {
        base: {
            path: '/' + getPluralTranslation(moduleName),
            component: baseComponent,
            meta: {auth: true},
        },
    };

    if (createComponent) routeSettings[CREATE] = partialFactory(moduleName, CREATE, createComponent);
    if (overviewComponent) routeSettings[OVERVIEW] = partialFactory(moduleName, OVERVIEW, overviewComponent);
    if (editComponent) routeSettings[EDIT] = partialFactory(moduleName, EDIT, editComponent);
    if (showComponent) routeSettings[SHOW] = partialFactory(moduleName, SHOW, showComponent);

    return routeSettings;
};

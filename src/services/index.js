import Vue from 'vue';

import Vuex from 'vuex';
// Bind the store to Vue and generate empty store
Vue.use(Vuex);
const store = new Vuex.Store();

import VueRouter from 'vue-router';
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [],
});

import {HTTPService} from './http';
export const httpService = new HTTPService();

import {EventService} from './event';
export const eventService = new EventService(httpService);

import {TranslatorService} from './translator';
export const translatorService = new TranslatorService();

import {RouterService} from './router';
import {RouteFactory} from './router/factory';
import {RouteSettings} from './router/settings';

const routeFactory = new RouteFactory();
const routeSettings = new RouteSettings(translatorService);
export const routerService = new RouterService(router, routeFactory, routeSettings);

import {StorageService} from './storage';
const storageService = new StorageService();

import {StoreModuleFactory} from './store/factory';
import {StoreService} from './store';

const storeFactory = new StoreModuleFactory(httpService, storageService);
export const storeService = new StoreService(store, storeFactory, httpService);

import {ErrorService} from './error';
export const errorService = new ErrorService(storeService, routerService, httpService);

import {LoadingService} from './loading';
export const loadingService = new LoadingService(storeService, httpService);

import {AuthService} from './auth';

export const authService = new AuthService(routerService, storeService, storageService, httpService);

import {PageCreatorService} from './pageCreator';
export const pageCreatorService = new PageCreatorService(errorService, translatorService, eventService, routerService);

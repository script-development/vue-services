/**
 * @typedef {import('vue-router').LocationQuery} LocationQuery
 *
 * @typedef {import('../../types/types').Item} Item
 * @typedef {import('../../types/types').Translation} Translation
 * @typedef {import('../../types/module').ModuleFactoryComponents} ModuleFactoryComponents
 * @typedef {import('../../types/module').Module} Module
 *
 */
import {defineComponent, h} from 'vue';
// import {RouterView} from 'vue-router';

import MinimalRouterView from './MinimalRouterView';

import RouteSettingFactory from '../services/router/settings';
import {deleteRequest, getRequest, postRequest} from '../services/http';
import {generateAndRegisterDefaultStoreModule, getAllFromStore, getByIdFromStore} from '../services/store';
import {setTranslation} from '../services/translator';
import {addRoutesBasedOnRouteSettings, getCurrentRouteId, goToRoute} from '../services/router';

/**
 * @param {string} moduleName
 * @param {ModuleFactoryComponents} components
 * @param {Translation} translation
 *
 * @returns {Module}
 */
export const moduleFactory = (moduleName, components, translation) => {
    generateAndRegisterDefaultStoreModule(moduleName);
    setTranslation(moduleName, translation);

    /** @type {Module} */
    // @ts-ignore It's not a complete module yet, don't want to set everything to undefined or null first
    const createdModule = {
        /**
         * Sends a delete request to the server.
         * Delete's the given id from the server
         *
         * @param {number} id the id to delete from the server
         */
        destroyItemRequest: id =>
            deleteRequest(`${moduleName}/${id}`).then(response => {
                // deleteFromStore?
                return response;
            }),

        /**
         * Sends a post request to the server, which updates the given item on the server
         *
         * @param {Item} item the item to be updated
         */
        updateItemRequest: item => postRequest(`${moduleName}/${item.id}`, item),

        /**
         * Sends a post request to the server, which creates the item on the server
         *
         * @param {Item} item the item to be created
         */
        createItemRequest: item => postRequest(moduleName, item),

        /**
         * Sends a get request to the server, which returns all items on the server from that endpoint
         */
        fetchAllFromServer: () => getRequest(moduleName),

        /**
         * Sends a get request to the server, which returns a single item on the server based on the given id
         *
         * @param {number} id the id to be read
         */
        fetchItemFromServer: id => getRequest(`${moduleName}/${id}`),

        /**
         * Sends a get request to the server, which returns a single item on the server based on the current route id
         */
        fetchItemFromServerByCurrentRouteId: () => getRequest(`${moduleName}/${getCurrentRouteId()}`),

        /**
         * get all items from the store from this module
         */
        get getAllFromStore() {
            return getAllFromStore(moduleName);
        },
        /**
         * Get an item from the store based on the given id
         * @param {number} id get the item from the store based on id
         */
        getByIdFromStore: id => getByIdFromStore(moduleName, id),

        /**
         * Get an item based on the current route id
         */
        get getByCurrentRouteIdFromStore() {
            return getByIdFromStore(moduleName, getCurrentRouteId());
        },
    };

    if (!components.base) {
        components.base = defineComponent({
            name: `${moduleName}-base`,
            // TODO #9 @Goosterhof
            mounted: createdModule.fetchAllFromServer,
            // TODO :: check if this works in every case
            render: () => h(MinimalRouterView, {depth: 1}),
            // render: () => h(RouterView),
        });
    }

    createdModule.routeSettings = RouteSettingFactory(
        moduleName,
        components.base,
        components.overview,
        components.create,
        components.edit,
        components.show
    );

    /** Go to the over view page fromm this controller */
    createdModule.goToOverviewPage = () => {
        if (!createdModule.routeSettings.overview) return;
        if (!createdModule.routeSettings.overview.name) return;
        goToRoute(createdModule.routeSettings.overview.name.toString());
    };
    /**
     * Go the the show page for the given id
     *
     * @param {number} id id of item to go to the show page
     */
    createdModule.goToShowPage = id => {
        if (!createdModule.routeSettings.show) return;
        if (!createdModule.routeSettings.show.name) return;
        goToRoute(createdModule.routeSettings.show.name.toString(), id);
    };
    /**
     * Go to the edit page for this controller
     *
     * @param {number} id
     * @param {LocationQuery} [query] the optional query for the new route
     */
    createdModule.goToEditPage = (id, query) => {
        if (!createdModule.routeSettings.edit) return;
        if (!createdModule.routeSettings.edit.name) return;
        goToRoute(createdModule.routeSettings.edit.name.toString(), id, query);
    };
    /**
     * Go to the create page for this controller
     *
     * @param {LocationQuery} [query] the optional query for the new route
     */
    createdModule.goToCreatePage = query => {
        if (!createdModule.routeSettings.create) return;
        if (!createdModule.routeSettings.create.name) return;
        goToRoute(createdModule.routeSettings.create.name.toString(), undefined, query);
    };

    /**
     * Init the controller.
     * This will register the routes.
     */
    createdModule.init = () => addRoutesBasedOnRouteSettings(createdModule.routeSettings);

    return createdModule;
};

export {MinimalRouterView};
// import MinimalRouterView from '../components/MinimalRouterView';
// import {storeService, routerService, eventService, translatorService} from '../services';

// export class BaseController {
//     /** The standard message to show in the destroy modal */
//     get destroyModalMessage() {
//         return `Weet je zeker dat je deze ${this._translatorService.getSingular(this.APIEndpoint)} wil verwijderen?`;
//     }

//     /** Shows a modal with the standard destroy modal message. On OK will send a destroy request based on the current route id */
//     get destroyByCurrentRouteIdModal() {
//         return () => this._eventService.modal(this.destroyModalMessage, this.destroyByCurrentRouteId);
//     }

//     /**
//      * Shows a modal with the standard destroy modal message. On OK will send a destroy request based on the given id
//      * @param {String|Number} id
//      */
//     get destroyByIdModal() {
//         return id => this._eventService.modal(this.destroyModalMessage, () => this.destroyByIdWithoutRouteChange(id));
//     }

//     /**
//      * pops up a modal with the given message
//      * @param {String} message the message being shown by the modal
//      * @param {Function} okAction the function being used when click on ok
//      * @param {Function} [cancelAction] the being used when click on cancel
//      */
//     popModal(message, okAction, cancelAction) {
//         this._eventService.modal(message, okAction, cancelAction);
//     }
// }

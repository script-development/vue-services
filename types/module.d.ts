import {AxiosResponse} from 'axios';
import {Component, ComponentOptions, ComputedRef} from 'vue';
import {LocationQuery} from 'vue-router';
import {RouteSettings} from './services/router';
import {Item, Translation} from './types';

export type ModuleFactoryComponents = {
    base?: Component;
    overview?: Component;
    create?: Component;
    edit?: Component;
    show?: Component;
};

export const MinimalRouterView: ComponentOptions<{depth: number}>;

export type Module = {
    routeSettings: RouteSettings;
    /** Go to the over view page fromm this controller */
    goToOverviewPage(): void;
    /**
     * Go the the show page for the given id
     *
     * @param {string} id id of item to go to the show page
     */
    goToShowPage(id: string): void;
    /**
     * Go to the edit page for this controller
     *
     * @param {string} id
     * @param {LocationQuery} [query] the optional query for the new route
     */
    goToEditPage(id: string, query?: LocationQuery): void;
    /**
     * Go to the create page for this controller
     *
     * @param {LocationQuery} [query] the optional query for the new route
     */
    goToCreatePage(query?: LocationQuery): void;
    /**
     * Sends a delete request to the server.
     * Delete's the given id from the server
     *
     * @param {string} id the id to delete from the server
     */
    destroyStoreAction(id: string): Promise<AxiosResponse>;

    /**
     * Sends a post request to the server, which updates the given item on the server
     *
     * @param {Item} item the item to be updated
     */
    updateStoreAction(item: Item): Promise<AxiosResponse>;

    /**
     * Sends a post request to the server, which creates the item on the server
     *
     * @param {Item} item the item to be created
     */
    createStoreAction(item: Item): Promise<AxiosResponse>;
    /**
     * Sends a get request to the server, which returns all items on the server from that endpoint
     */
    readStoreAction(): Promise<AxiosResponse>;

    /**
     * Sends a get request to the server, which returns a single item on the server based on the given id
     *
     * @param {string} id the id to be read
     */
    showStoreAction(id: string): Promise<AxiosResponse>;

    /**
     * Sends a get request to the server, which returns a single item on the server based on the given id
     *
     * @param {string} id the id to be read
     */
    showStoreActionByCurrentRouteId(): Promise<AxiosResponse>;

    /**
     * get all items from the store from this controller
     */
    getAll: ComputedRef<Item[]>;
    /**
     * Get an item from the store based on the given id
     * @param {string} id get the item from the store based on id
     */
    getById(id: string): Item;

    /**
     * Get an item based on the current route id
     */
    getByCurrentRouteId: Item;

    /**
     * Init the controller.
     * This will register the routes.
     */
    init(): void;
};

export declare function moduleFactory(
    moduleName: string,
    components: ModuleFactoryComponents,
    translation: Translation
): Module;

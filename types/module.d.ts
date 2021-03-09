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

export declare interface Module<T extends object> {
    routeSettings: RouteSettings;
    /** Go to the over view page fromm this controller */
    goToOverviewPage(): void;
    /**
     * Go the the show page for the given id
     *
     * @param {number} id id of item to go to the show page
     */
    goToShowPage(id: number): void;
    /**
     * Go to the edit page for this controller
     *
     * @param {number} id
     * @param {LocationQuery} [query] the optional query for the new route
     */
    goToEditPage(id: number, query?: LocationQuery): void;
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
     * @param {number} id the id to delete from the server
     */
    destroyItemRequest(id: number): Promise<AxiosResponse>;

    /**
     * Sends a post request to the server, which updates the given item on the server
     *
     * @param {Item} item the item to be updated
     */
    updateItemRequest(item: T): Promise<AxiosResponse>;

    /**
     * Sends a post request to the server, which creates the item on the server
     *
     * @param {Item} item the item to be created
     */
    createItemRequest(item: T): Promise<AxiosResponse>;
    /**
     * Sends a get request to the server, which returns all items on the server from that endpoint
     */
    fetchAllFromServer(): Promise<AxiosResponse | undefined>;

    /**
     * Sends a get request to the server, which returns a single item on the server based on the given id
     *
     * @param {number} id the id to be read
     */
    fetchItemFromServer(id: number): Promise<AxiosResponse | undefined>;

    /**
     * Sends a get request to the server, which returns a single item on the server based on the given id
     */
    fetchItemFromServerByCurrentRouteId(): Promise<AxiosResponse | undefined>;

    /**
     * get all items from the store from this controller
     */
    getAllFromStore: ComputedRef<T[]>;
    /**
     * Get an item from the store based on the given id
     * @param {number} id get the item from the store based on id
     */
    getByIdFromStore(id: number): ComputedRef<T>;

    /**
     * Get an item based on the current route id
     */
    getByCurrentRouteIdFromStore: ComputedRef<T>;

    /**
     * Init the controller.
     * This will register the routes.
     */
    init(): void;
}

export declare function moduleFactory(
    moduleName: string,
    components: ModuleFactoryComponents,
    translation: Translation
): Module<any>;

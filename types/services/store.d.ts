import {ComputedRef} from 'vue';
import {Item} from '../types';

export type StoreModule = {
    /** Get all items from the store */
    all: ComputedRef<Readonly<Item>[]>;
    /** Get an item from the state by id */
    byId(id: number): ComputedRef<Readonly<Item>>;
    /**
     * Set data in the state.
     * Data can be of any kind.
     */
    setAll(incomingData: Item | Item[]): void;
};
export type Store = {[moduleName: string]: StoreModule};

/**
 * Creates a store module for the given module name.
 * When extra store functionality is given, it will extend the base module with the extra functionality.
 *
 * @param {string} moduleName the name of the module, also the endpoint for the module
 */
export function StoreModuleFactory(moduleName: string): StoreModule;

/**
 * Get all from data from the given store module
 *
 * @param {string} moduleName the module from which to get all
 */
export function getAllFromStore(moduleName: string): ComputedRef<Readonly<Item>[]>;

/**
 * Get all data from the given store module by id
 *
 * @param {string} moduleName the module from which to get all
 * @param {number} id the id of the data object to get
 */
export function getByIdFromStore(moduleName: string, id: number): ComputedRef<Readonly<Item>>;

/**
 * generate and set the default store module in the store
 *
 * @param {string} moduleName the name of the module
 */
export function generateAndRegisterDefaultStoreModule(moduleName: string): void;

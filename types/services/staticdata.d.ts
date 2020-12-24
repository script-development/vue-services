import {ComputedRef} from 'vue';
import {Item} from '../types';

/**
 * Get all from a specific segment in the staticdata store
 *
 * @param {String} data the module from which to get all data from
 */
export function getStaticDataSegment(data: String): void;

/**
 * Get all data from the given store module by id
 *
 * @param {String} data the module from which to get all
 * @param {String} id the id of the data object to get
 */
export function getStaticDataItemById(data: string, id: string): ComputedRef<Item>;

/**
 * Sends requests to the server which recieves all the staticdata from the server defined in DATA
 */
export function getStaticDataFromServer(): Promise<void>;

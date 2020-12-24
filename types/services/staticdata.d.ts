import {Item} from '../types';

/**
 * Get all from a specific segment in the staticdata store
 *
 * @param {string} staticDataName the name of the segement to get data from
 */
export function getStaticDataSegment(staticDataName: string): Item[];

/**
 * Get all data from the given staticDataName by id
 *
 * @param {string} data the name of the segement to get data from
 * @param {string} id the id of the data object to get
 */
export function getStaticDataItemById(staticDataName: string, id: string): Item;

/**
 * Sends requests to the server which recieves all the staticdata from the server defined in DATA
 */
export function getStaticDataFromServer(): Promise<void>;

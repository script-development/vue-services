import {AxiosResponse} from 'axios';
import {Item} from '../types';

// TODO :: make a StaticDataItem

/**
 * Get all from a specific segment in the staticdata store
 *
 * @param {string} staticDataName the name of the segement to get data from
 */
export function getStaticDataSegment(staticDataName: string): Readonly<Item>[];

/**
 * Get all data from the given staticDataName by id
 *
 * @param {string} data the name of the segement to get data from
 * @param {number} id the id of the data object to get
 */
export function getStaticDataItemById(staticDataName: string, id: number): Readonly<Item>;

/**
 * Sends requests to the server which recieves all the staticdata from the server defined in DATA
 */
export function getStaticDataFromServer(): Promise<AxiosResponse<any>>;

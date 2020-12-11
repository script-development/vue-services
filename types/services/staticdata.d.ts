import {ComputedRef} from 'vue';
import {Item} from '../types';

/**
 * Get all from a specific segment in the staticdata store
 *
 * @param {String} data the module from which to get all data from
 */
export function getStaticDataSegment(data: String): void

/**
 * Get all data from the given store module by id
 *
 * @param {String} data the module from which to get all
 * @param {Number} id the id of the data object to get
 */
export function byId(data: string, id: number): ComputedRef<Item>

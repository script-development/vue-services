import {Ref} from 'vue';

/**
 * get the loading state
 */
export const loading: Ref<boolean>;

/**
 * Set the loading state.
 * Does not set the state immediatly after recieving false.
 * It only sets it before 500ms or after 1500ms.
 *
 * @param {Boolean} newLoading the loading state
 */
export function setLoading(newLoading: boolean): void;

/**
 * @typedef {import('vue').Ref} Ref
 */

import {ref} from 'vue';
import {registerRequestMiddleware, registerResponseMiddleware, registerResponseErrorMiddleware} from '../http';

let spinnerTimeout = 500;
let minTimeSpinner = 1000;

let loadingTimeoutId;
let loadingTimeStart;

registerRequestMiddleware(() => setLoading(true));
registerResponseMiddleware(() => setLoading(false));
registerResponseErrorMiddleware(() => setLoading(false));

/**
 * Set the timeout before the spinner time starts.
 * This is exposed so tests can change these values
 * @param {number} ms
 */
export const setSpinnerTimeout = ms => (spinnerTimeout = ms);

/**
 * Set the minimum time the spinner is active
 * This is exposed so tests can change these values
 * @param {number} ms
 */
export const setMinTimeSpinner = ms => (minTimeSpinner = ms);

/**
 * get the loading state
 *
 * @returns {Ref<boolean>}
 */
export const loading = ref(false);
/**
 * Set the loading state.
 * Does not set the state immediatly after recieving false.
 * It only sets it before 500ms or after 1500ms.
 *
 * @param {Boolean} newLoading the loading state
 */
export const setLoading = newLoading => {
    if (loadingTimeoutId) clearTimeout(loadingTimeoutId);

    let timeout = spinnerTimeout;

    if (newLoading) {
        // set the time the loading started
        loadingTimeStart = Date.now();
    } else if (loadingTimeStart) {
        // get the response time from the request
        const responseTime = Date.now() - loadingTimeStart;
        // check the time the spinner is already active and how many ms it should stay active to get to the min time of the spinner
        timeout = minTimeSpinner - responseTime + spinnerTimeout;
        if (timeout < 0) timeout = 0;
        loadingTimeStart = undefined;
    }

    loadingTimeoutId = setTimeout(() => (loading.value = newLoading), timeout);
};

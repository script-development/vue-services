/**
 * @typedef {import('vue').Ref} Ref
 */

import {ref} from 'vue';
import {registerRequestMiddleware, registerResponseMiddleware, registerResponseErrorMiddleware} from '../http';

let spinnerTimeout = 500;
let minTimeSpinner = 1000;

/** @type {NodeJS.Timeout} */
let loadingTimeoutId;
/** @type {number|undefined} */
let loadingTimeStart;

registerRequestMiddleware(() => setLoading(true));
registerResponseMiddleware(() => setLoading(false));
registerResponseErrorMiddleware(() => setLoading(false));

/**
 * get the loading state
 *
 * @returns {Ref<boolean>}
 */
export const loading = ref(false);

/**
 * get the spinner loading state
 *
 * @returns {Ref<boolean>}
 */
export const spinnerLoading = ref(false);

/**
 * Set the loading state.
 * Does not set the state immediatly after recieving false.
 * It only sets it before 500ms or after 1500ms.
 *
 * @param {Boolean} newLoading the loading state
 */
export const setLoading = newLoading => {
    loading.value = newLoading;
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

    loadingTimeoutId = setTimeout(() => (spinnerLoading.value = newLoading), timeout);
};

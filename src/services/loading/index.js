/**
 * @typedef {import('../http').RequestMiddleware} RequestMiddleware
 * @typedef {import('../http').ResponseMiddleware} ResponseMiddleware
 * @typedef {import('../http').ResponseErrorMiddleware} ResponseErrorMiddleware
 */

import {ref} from 'vue';
// import {registerRequestMiddleware, registerResponseMiddleware, registerResponseErrorMiddleware} from '../http';

let spinnerTimeout = 500;
let minTimeSpinner = 1000;

let loadingTimeoutId;
let loadingTimeStart;

// registerRequestMiddleware(requestMiddleware);
// registerResponseMiddleware(responseMiddleware);
// registerResponseErrorMiddleware(responseMiddleware);

/**
 * get the loading state
 *
 * @returns {Boolean}
 */
export const loading = ref(false);

/**
 * Set the loading state
 *
 * @param {Boolean} loading the loading state
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

// /** @returns {RequestMiddleware} */
// const requestMiddleware = () => setLoading(true);

// /** @returns {ResponseMiddleware | ResponseErrorMiddleware} */
// const responseMiddleware = () => setLoading(false);

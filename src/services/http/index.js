/**
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 *
 * @typedef {import('../../../types/types').Cache} Cache
 * @typedef {import('../../../types/types').RequestMiddleware} RequestMiddleware
 * @typedef {import('../../../types/types').ResponseMiddleware} ResponseMiddleware
 * @typedef {import('../../../types/types').ResponseErrorMiddleware} ResponseErrorMiddleware
 */
import axios from 'axios';

/** @type {Object<string,string>} */
const HEADERS_TO_TYPE = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'application/xlsx',
};

const CACHE_KEY = 'HTTP_CACHE';

/** @type {number} */
let cacheDuration = 0;
let baseURL = '/api';

// Not using storageService here, cause it always needs to be stored in the localStorage
const preCache = localStorage.getItem(CACHE_KEY);
// TODO :: how to test these branches?
/** @type {Cache} */
const cache = preCache ? JSON.parse(preCache) : {};

const http = axios.create({
    baseURL,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

/** @type {RequestMiddleware[]} */
const requestMiddleware = [];
/** @type {ResponseMiddleware[]} */
const responseMiddleware = [];
/** @type {ResponseErrorMiddleware[]} */
const responseErrorMiddleware = [];

http.interceptors.request.use(request => {
    for (const middleware of requestMiddleware) middleware(request);
    return request;
});

http.interceptors.response.use(
    response => {
        for (const middleware of responseMiddleware) middleware(response);
        return response;
    },
    error => {
        if (!error.response) return Promise.reject(error);
        for (const middleware of responseErrorMiddleware) middleware(error);
        return Promise.reject(error);
    }
);

/** @param {number} value */
export const setCacheDuration = value => (cacheDuration = value);
export const getCacheDuration = () => cacheDuration;

/** @param {string} value */
export const setBaseURL = value => (baseURL = value);

/**
 * send a get request to the given endpoint
 * @param {string} endpoint the endpoint for the get
 * @param {AxiosRequestConfig} [options] the optional request options
 */
export const getRequest = async (endpoint, options) => {
    // get currentTimeStamp in seconds
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    if (cache[endpoint] && !options) {
        // if it has been less then the cache duration since last requested this get request, do nothing
        if (currentTimeStamp - cache[endpoint] < cacheDuration) return;
    }

    return http.get(endpoint, options).then(response => {
        cache[endpoint] = currentTimeStamp;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        return response;
    });
};

/**
 * send a get request to the given endpoint without using cache
 * @param {string} endpoint the endpoint for the get
 * @param {AxiosRequestConfig} [options] the optional request options
 */
export const getRequestWithoutCache = async (endpoint, options) => http.get(endpoint, options);

/**
 * send a post request to the given endpoint with the given data
 * @param {string} endpoint the endpoint for the post
 * @param {any} data the data to be send to the server
 */
export const postRequest = async (endpoint, data) => http.post(endpoint, data);

/**
 * send a delete request to the given endpoint
 * @param {string} endpoint the endpoint for the get
 */
export const deleteRequest = async endpoint => http.delete(endpoint);

/**
 * download a file from the backend
 * type should be resolved automagically, if not, then you can pass the type
 * @param {string} endpoint the endpoint for the download
 * @param {string} documentName the name of the document to be downloaded
 * @param {string} [type] the downloaded document type
 */
export const download = async (endpoint, documentName, type) =>
    http.get(endpoint, {responseType: 'blob'}).then(response => {
        if (!type) type = HEADERS_TO_TYPE[response.headers['content-type']];
        const blob = new Blob([response.data], {type});
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = documentName;
        link.click();
        return response;
    });

/** @param {RequestMiddleware} middlewareFunc */
export const registerRequestMiddleware = middlewareFunc => requestMiddleware.push(middlewareFunc);

/** @param {ResponseMiddleware} middlewareFunc */
export const registerResponseMiddleware = middlewareFunc => responseMiddleware.push(middlewareFunc);

/** @param {ResponseErrorMiddleware} middlewareFunc */
export const registerResponseErrorMiddleware = middlewareFunc => responseErrorMiddleware.push(middlewareFunc);

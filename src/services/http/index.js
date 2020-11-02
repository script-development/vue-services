/**
 * @typedef {import('axios').AxiosResponse} AxiosResponse
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 * @typedef {import('axios').AxiosError} AxiosError
 *
 * @typedef {Object<string,number>} Cache
 *
 * @typedef {(response: AxiosRequestConfig) => void} RequestMiddleware
 * @typedef {(response: AxiosResponse) => void} ResponseMiddleware
 * @typedef {(response: AxiosError) => void} ResponseErrorMiddleware
 */

import {getItemFromStorage, setItemInStorage} from '../storage';
import axios from 'axios';
// TODO :: heavilly dependant on webpack and laravel mix
const API_URL = process.env.MIX_APP_URL ? `${process.env.MIX_APP_URL}/api` : '/api';
const HEADERS_TO_TYPE = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'application/xlsx',
};

const CACHE_KEY = 'HTTP_CACHE';

/** @type {number} */
let cacheDuration = 10;

const cache = getItemFromStorage(CACHE_KEY, true) || {};

const http = axios.create({
    baseURL: API_URL,
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

/**
 * send a get request to the given endpoint
 * @param {String} endpoint the endpoint for the get
 * @param {AxiosRequestConfig} [options] the optional request options
 */
export const getRequest = (endpoint, options) => {
    // get currentTimeStamp in seconds
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    if (cache[endpoint] && !options) {
        // if it has been less then the cache duration since last requested this get request, do nothing
        if (currentTimeStamp - cache[endpoint] < cacheDuration) return;
    }

    return http.get(endpoint, options).then(response => {
        cache[endpoint] = currentTimeStamp;
        setItemInStorage(CACHE_KEY, cache);
        return response;
    });
};

export default {
    // prettier-ignore
    get cacheDuration() {return cacheDuration;},

    // prettier-ignore
    /** @param {number} value  */
    set cacheDuration(value) {cacheDuration = value;},

    get: getRequest,

    // prettier-ignore
    /**
     * send a post request to the given endpoint with the given data
     * @param {String} endpoint the endpoint for the post
     * @param {any} data the data to be send to the server
     */
    post(endpoint, data) { return http.post(endpoint, data); },

    // prettier-ignore
    /**
     * send a delete request to the given endpoint
     * @param {String} endpoint the endpoint for the get
     */
    delete(endpoint) { return http.delete(endpoint); },

    /**
     * download a file from the backend
     * type should be resolved automagically, if not, then you can pass the type
     * @param {String} endpoint the endpoint for the download
     * @param {String} documentName the name of the document to be downloaded
     * @param {String} [type] the downloaded document type
     */
    download(endpoint, documentName, type) {
        return http.get(endpoint, {responseType: 'blob'}).then(response => {
            if (!type) type = HEADERS_TO_TYPE[response.headers['content-type']];
            const blob = new Blob([response.data], {type});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = documentName;
            link.click();
            return response;
        });
    },

    /** @param {RequestMiddleware} middlewareFunc */
    registerRequestMiddleware(middlewareFunc) {
        requestMiddleware.push(middlewareFunc);
    },

    /** @param {ResponseMiddleware} middlewareFunc */
    registerResponseMiddleware(middlewareFunc) {
        responseMiddleware.push(middlewareFunc);
    },

    /** @param {ResponseErrorMiddleware} middlewareFunc */
    registerResponseErrorMiddleware(middlewareFunc) {
        responseErrorMiddleware.push(middlewareFunc);
    },
};

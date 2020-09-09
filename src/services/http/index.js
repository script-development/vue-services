/**
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 * @typedef {import('../storage').StorageService} StorageService
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

import axios from 'axios';
// TODO :: heavilly dependant on webpack and laravel mix
const API_URL = process.env.MIX_APP_URL ? `${process.env.MIX_APP_URL}/api` : '/api';
const HEADERS_TO_TYPE = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'application/xlsx',
};

const CACHE_KEY = 'HTTP_CACHE';

export class HTTPService {
    /**
     * @param {StorageService} storageService
     */
    constructor(storageService) {
        this._storageService = storageService;
        /** @type {Cache} */
        this._cache = this._storageService.getItem(CACHE_KEY, true) || {};
        this._cacheDuration = 10;

        this._http = axios.create({
            baseURL: API_URL,
            withCredentials: false,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        /** @type {RequestMiddleware[]} */
        this._requestMiddleware = [];

        /** @type {ResponseMiddleware[]} */
        this._responseMiddleware = [];

        /** @type {ResponseErrorMiddleware[]} */
        this._responseErrorMiddleware = [];

        this._http.interceptors.request.use(request => {
            for (const middleware of this._requestMiddleware) {
                middleware(request);
            }
            return request;
        });

        this._http.interceptors.response.use(
            response => {
                for (const middleware of this._responseMiddleware) {
                    middleware(response);
                }
                return response;
            },
            error => {
                if (!error.response) return Promise.reject(error);

                for (const middleware of this._responseErrorMiddleware) {
                    middleware(error);
                }
                return Promise.reject(error);
            }
        );
    }

    // prettier-ignore
    get cacheDuration() {return this._cacheDuration;}

    // prettier-ignore
    set cacheDuration(value) {this._cacheDuration = value;}

    /**
     * send a get request to the given endpoint
     * @param {String} endpoint the endpoint for the get
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    get(endpoint, options) {
        // get currentTimeStamp in seconds
        const currentTimeStamp = Math.floor(Date.now() / 1000);
        if (this._cache[endpoint] && !options) {
            // if it has been less then the cache duration since last requested this get request, do nothing
            if (currentTimeStamp - this._cache[endpoint] < this.cacheDuration) return;
        }

        return this._http.get(endpoint, options).then(response => {
            this._cache[endpoint] = currentTimeStamp;
            this._storageService.setItem(CACHE_KEY, this._cache);
            return response;
        });
    }

    /**
     * send a post request to the given endpoint with the given data
     * @param {String} endpoint the endpoint for the post
     * @param {any} data the data to be send to the server
     */
    post(endpoint, data) {
        return this._http.post(endpoint, data);
    }

    /**
     * send a delete request to the given endpoint
     * @param {String} endpoint the endpoint for the get
     */
    delete(endpoint) {
        return this._http.delete(endpoint);
    }

    /**
     * download a file from the backend
     * type should be resolved automagically, if not, then you can pass the type
     * @param {String} endpoint the endpoint for the download
     * @param {String} documentName the name of the document to be downloaded
     * @param {String} [type] the downloaded document type
     */
    download(endpoint, documentName, type) {
        return this._http.get(endpoint, {responseType: 'blob'}).then(response => {
            if (!type) type = HEADERS_TO_TYPE[response.headers['content-type']];
            const blob = new Blob([response.data], {type});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = documentName;
            link.click();
            return response;
        });
    }

    /** @param {RequestMiddleware} middlewareFunc */
    registerRequestMiddleware(middlewareFunc) {
        this._requestMiddleware.push(middlewareFunc);
    }

    /** @param {ResponseMiddleware} middlewareFunc */
    registerResponseMiddleware(middlewareFunc) {
        this._responseMiddleware.push(middlewareFunc);
    }

    /** @param {ResponseErrorMiddleware} middlewareFunc */
    registerResponseErrorMiddleware(middlewareFunc) {
        this._responseErrorMiddleware.push(middlewareFunc);
    }
}

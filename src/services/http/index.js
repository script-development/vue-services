/**
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

import axios from 'axios';
const API_URL = process.env.MIX_APP_URL ? `${process.env.MIX_APP_URL}/api` : '/api';

const HEADERS_TO_TYPE = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'application/xlsx',
};
export class HTTPService {
    constructor() {
        this._http = axios.create({
            baseURL: API_URL,
            withCredentials: false,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        this._requestMiddleware = [];
        this._http.interceptors.request.use(request => {
            for (const middleware of this._requestMiddleware) {
                middleware(request);
            }
            return request;
        });

        this._responseMiddleware = [];
        this._responseErrorMiddleware = [];
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

    /**
     * send a get request to the given endpoint
     * @param {String} endpoint the endpoint for the get
     * @param {AxiosRequestConfig} [options] the optional request options
     */
    get(endpoint, options) {
        return this._http.get(endpoint, options);
    }

    /**
     * send a post request to the given endpoint with the given data
     * @param {String} endpoint the endpoint for the post
     * @param {Object.<string,*>} data the data to be send to the server
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

    registerRequestMiddleware(middlewareFunc) {
        this._requestMiddleware.push(middlewareFunc);
    }

    registerResponseMiddleware(middlewareFunc) {
        this._responseMiddleware.push(middlewareFunc);
    }

    registerResponseErrorMiddleware(middlewareFunc) {
        this._responseErrorMiddleware.push(middlewareFunc);
    }
}

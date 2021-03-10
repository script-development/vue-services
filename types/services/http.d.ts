import {AxiosResponse, AxiosRequestConfig} from 'axios';
import {RequestMiddleware, ResponseErrorMiddleware, ResponseMiddleware} from '../types';

export function setCacheDuration(value: number): void;
export function getCacheDuration(): number;

/**
 * send a get request to the given endpoint
 * Returns undefined if it hits cache
 *
 *
 * @param {string} endpoint the endpoint for the get
 * @param {AxiosRequestConfig} [options] the optional request options
 */
export function getRequest(endpoint: string, options?: AxiosRequestConfig): Promise<AxiosResponse | undefined>;

/**
 * send a get request to the given endpoint without using cache
 * @param {string} endpoint the endpoint for the get
 * @param {AxiosRequestConfig} [options] the optional request options
 */
export function getRequestWithoutCache(endpoint: string, options?: AxiosRequestConfig): Promise<AxiosResponse>;

/**
 * send a post request to the given endpoint with the given data
 * @param {string} endpoint the endpoint for the post
 * @param {any} data the data to be send to the server
 */
export function postRequest(endpoint: string, data: any): Promise<AxiosResponse>;

/**
 * send a delete request to the given endpoint
 * @param {string} endpoint the endpoint for the get
 */
export function deleteRequest(endpoint: string): Promise<AxiosResponse>;

/**
 * download a file from the backend
 * type should be resolved automagically, if not, then you can pass the type
 * @param {string} endpoint the endpoint for the download
 * @param {string} documentName the name of the document to be downloaded
 * @param {string} [type] the downloaded document type
 */
export function download(endpoint: string, documentName: string, type: string): Promise<AxiosResponse>;

export function registerRequestMiddleware(middlewareFunc: RequestMiddleware): void;
export function registerResponseMiddleware(middlewareFunc: ResponseMiddleware): void;
export function registerResponseErrorMiddleware(middlewareFunc: ResponseErrorMiddleware): void;

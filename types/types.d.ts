import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';

export type RequestMiddleware = (request: AxiosRequestConfig) => void;
export type ResponseMiddleware = (response: AxiosResponse) => void;
export type ResponseErrorMiddleware = (error: AxiosError) => void;

export type Cache = {[key: string]: number};

export type Item = {[property: string]: any};

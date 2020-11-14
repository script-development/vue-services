import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {Ref} from 'vue';

export type RequestMiddleware = (request: AxiosRequestConfig) => void;
export type ResponseMiddleware = (response: AxiosResponse) => void;
export type ResponseErrorMiddleware = (error: AxiosError) => void;

export type Cache = {[key: string]: number};

export type Item = {id: string | undefined; [property: string]: any};

export type State = Ref<{[id: string]: Item}>;

export type Translation = {singular: string; plural: string};
export type Translations = {[moduleName: string]: Translation};

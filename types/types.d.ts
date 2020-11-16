import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {Ref} from 'vue';
import {Module} from './module';

export type RequestMiddleware = (request: AxiosRequestConfig) => void;
export type ResponseMiddleware = (response: AxiosResponse) => void;
export type ResponseErrorMiddleware = (error: AxiosError) => void;

export type Cache = {[key: string]: number};

export type Item = {id: string | undefined; [property: string]: any};

export type State = Ref<{[id: string]: Item}>;

export type Translation = {singular: string; plural: string};
export type Translations = {[moduleName: string]: Translation};

export type Modules = {[moduleName: string]: Module};

export type LoginCredentials = {
    /** the email to login with */
    email: string;
    /** the password to login with */
    password: string;
    /** if you want a consistent login */
    rememberMe: boolean;
};

export type ResetPasswordData = {
    password: string;
    repeatPassword: string;
};

export type IsLoggedIn = Ref<boolean>;
export type LoggedInUser = Ref<Item>;

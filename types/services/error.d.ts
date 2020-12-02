import {DefineComponent} from 'vue';
import {NavigationHookAfter} from 'vue-router';
import {ResponseErrorMiddleware} from '../types';

export const routeMiddleware: NavigationHookAfter;
export const responseErrorMiddleware: ResponseErrorMiddleware;

export const BaseFormError: DefineComponent<{
    property: {
        type: StringConstructor;
        required: true;
    };
}>;

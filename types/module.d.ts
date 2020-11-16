import {Component} from 'vue';
import {Translation} from './types';

type ModuleFactoryComponents = {
    base?: Component;
    overview?: Component;
    create?: Component;
    edit?: Component;
    show?: Component;
};

export type Module = {};

export declare function moduleFactory(
    moduleName: string,
    components: ModuleFactoryComponents,
    translation: Translation
): Module;

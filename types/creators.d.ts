import {ErrorService, TranslatorService, EventService} from './services';
import {RouterService} from './routerService';
import {CreateElement, Component, VNode} from 'vue';

// TODO :: make this complete
export class PageCreator {
    _h: CreateElement;
    _errorService: ErrorService;
    _translatorService: TranslatorService;
    _eventService: EventService;
    _routerService: RouterService;

    /** @param {CreateElement} h */
    init(h: CreateElement): void;

    createPage(form: any, modelFactory: any, subject: any, createAction: any, title: any): Component;
    editPage(form: any, getter: any, subject: any, updateAction: any, destroyAction: any): Component;
    /** @param {VNode[]} children */
    createContainer(children: VNode[]): VNode;
    /** @param {VNode[]} children */
    createRow(children: VNode[]): VNode;
    /** @param {VNode[]} children */
    createCol(children: VNode[]): VNode;
    /** @param {String} title */
    createTitle(title: string): VNode;
    /** @param {String} subject */
    createCreatePageTitle(subject: string): VNode;
    /** @param {Object<string,any>} item */
    createEditPageTitle(item: {[x: string]: any}): VNode;
    /**
     * @param {Component} form
     * @param {Object<string,any>} editable
     * @param {(item:Object<string,any) => void} action
     */
    createForm(
        form: Component,
        editable: {
            [x: string]: any;
        },
        action: (item: {[x: string]: any}) => void
    ): VNode;
    /**
     * @param {Object<string,any>} editable
     */
    checkQuery(editable: {[x: string]: any}): void;
}

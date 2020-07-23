import {ErrorService, TranslatorService, EventService} from './services';
import {RouterService} from './routerService';

// TODO :: make this complete
export class PageCreator {
    /**
     * @param {ErrorService} errorService
     * @param {TranslatorService} translatorService
     * @param {EventService} eventService
     * @param {RouterService} routerService
     */
    constructor(
        errorService: ErrorService,
        translatorService: TranslatorService,
        eventService: EventService,
        routerService: RouterService
    );
    _errorService: ErrorService;
    _translatorService: TranslatorService;
    _eventService: EventService;
    _routerService: RouterService;
    createPage(
        form: any,
        modelFactory: any,
        subject: any,
        createAction: any,
        title: any
    ): {
        name: string;
        data: () => {
            editable: any;
        };
        render(h: any): VNode;
        mounted(): void;
    };
    editPage(
        form: any,
        getter: any,
        subject: any,
        updateAction: any,
        destroyAction: any
    ): {
        name: string;
        computed: {
            item(): any;
        };
        render(h: any): VNode;
        mounted(): void;
    };
    /**
     * @param {CreateElement} h
     * @param {VNode[]} children
     */
    createContainer(h: CreateElement, children: VNode[]): VNode;
    /**
     * @param {CreateElement} h
     * @param {String} title
     */
    createTitle(h: CreateElement, title: string): VNode;
    /**
     * @param {CreateElement} h
     * @param {String} subject
     */
    createCreatePageTitle(h: CreateElement, subject: string): VNode;
    /**
     * @param {CreateElement} h
     * @param {Object<string,any>} item
     */
    createEditPageTitle(
        h: CreateElement,
        item: {
            [x: string]: any;
        }
    ): VNode;
    /**
     * @param {CreateElement} h
     * @param {Component} form
     * @param {Object<string,any>} editable
     * @param {(item:Object<string,any) => void} action
     */
    createForm(
        h: CreateElement,
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

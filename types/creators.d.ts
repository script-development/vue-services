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

    /**
     * Generate a create page
     * @param {Component} form the form to create stuff with
     * @param {()=>Object<string,any} modelFactory the factory to create a new instance of a model
     * @param {String} subject the subject for which to create something for
     * @param {Function} createAction the action to send the newly created model to the backend
     * @param {String} [title] the optional title, will generate default one if nothing is given
     */
    createPage(
        form: Component,
        // TODO :: define model factory function
        modelFactory: Function,
        subject: string,
        createAction: Function,
        title: string
    ): Component;
    /**
     * Generate an edit page
     * @param {Component} form the form to create stuff with
     * @param {()=>Object<string,any} getter the getter to get the instance from the store
     * @param {String} subject the subject for which to create something for
     * @param {Function} updateAction the action to send the updated model to the backend
     * @param {Function} [destroyAction] the optional destroyAction, will attach a destroy button with this action
     * @param {Function} [showAction] the optional showAction, will get data from the server if given
     * @param {String|String[]} [titleItemProperty] the optional titleItemProperty, will show title based on the given property. If nothing is given then the creator will try to resolve a title
     */
    editPage(
        form: Component,
        // TODO :: define getter function
        getter: Function,
        subject: string,
        updateAction?: Function,
        destroyAction?: Function,
        titleItemProperty?: string | string[]
    ): Component;
    /**
     *
     * @param {String} subject the subject for which to create the overview page
     * @param {Function} getter the table to show items in
     * @param {Component} table the table to show items in
     * @param {Component} [filter] the filter to filter the items
     * @param {Function} [toCreatePage] the function to go to the create page
     */
    overviewPage(
        subject: string,
        getter: Function,
        table: Component,
        filter?: Component,
        toCreatePage?: Function
    ): Component;
    /** @param {VNode[]} children */
    createContainer(children: VNode[]): VNode;
    /** @param {VNode[]} children */
    createRow(children: VNode[]): VNode;
    /** @param {VNode[]} children */
    createCol(children: VNode[]): VNode;
    /** @param {String} title */
    createTitle(title: string): VNode;
    /** @param {String} title */
    createTitleRow(title: string): VNode;
    /** @param {String} subject */
    createCreatePageTitle(subject: string): VNode;
    /**
     * @param {String} subject
     * @param {Function} [toCreatePage]
     */
    createOverviewPageTitle(subject: string, toCreatePage: Function): VNode;
    /**
     * @param {Object<string,any>} item the item for which to show the title
     * @param {String|String[]} [titleItemProperty] the optional titleItemProperty, will show title based on the given property. If nothing is given then the creator will try to resolve a title
     */
    createEditPageTitle(item: {[x: string]: any}, titleItemProperty?: string | string[]): VNode;
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

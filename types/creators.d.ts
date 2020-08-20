import {ErrorService, TranslatorService, EventService} from './services';
import {RouterService} from './routerService';
import {CreateElement, Component, VNode} from 'vue';
import {BvTableField} from 'bootstrap-vue';

import StringInput from '../src/components/inputs/String';
import SelectInput from '../src/components/inputs/Select';
import MultiselectInput from '../src/components/inputs/Multiselect';
import NumberInput from '../src/components/inputs/Number';
import CheckboxInput from '../src/components/inputs/Checkbox';
import BaseFormError from '../src/components/FormError';

import {InvalidFormTypeGivenError} from '../src/errors/InvalidFormTypeGivenError';

export class PageCreator {
    _h: CreateElement;
    _errorService: ErrorService;
    _translatorService: TranslatorService;
    _eventService: EventService;
    _routerService: RouterService;

    /** @param {CreateElement} h */
    set h(h: CreateElement);

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

export class TableCreator {
    _h: CreateElement;
    _translatorService: TranslatorService;

    // prettier-ignore
    /** @param {CreateElement} h */
    set h(h:CreateElement)

    /**
     * @param {String} subject the subject for which to create the table for
     * @param {BvTableField[]} fields the subject for which to create the table for
     * @param {Function} [rowClicked] the subject for which to create the table for
     */
    table(subject: string, fields: BvTableField[], rowClicked?: Function): Component;

    /** @param {VNode[]} children */
    card(children: VNode[]): VNode;

    /** @param {String} title */
    title(title: string): VNode;

    bTable(items: {[key: string]: any}[], perPage: number, fields: BvTableField[], rowClicked?: Function): VNode;
}

type FormGroup = {
    property: string;
    label: string;
    type: string;
    options: string;
    valueField: string;
    textField: string;
    min: string;
    max: string;
    description: Array;
    component: component;
};

type FormInputData = {
    cardHeader: string;
};
export class FormCreator {
    _h: CreateElement;
    _translatorService: TranslatorService;

    // prettier-ignore
    /** @param {CreateElement} h */
    set h(h:CreateElement)

    /**
     * Generate a form
     * @param {String} subject the subject for which to create something for
     * @param {FormInputData[]} formData the data the form consists of
     */
    create(subject: string, formData: FormInputData[]): Component;

    /**
     * Generate an input
     * @param {Object<...string>} inputData the data used to generate an input field
     * @param {Object<string>} editable the editable property of the form
     */
    typeConverter(inputData: Object<string>, editable: Object<string>): Function;

    /** @param {String} title */
    title(title: string): VNode;

    /** @param {String} property */
    createError(property: string): Component;

    /**
     * @param {String} label
     * @param {VNode[]} inputField
     */
    createFormGroup(label: string, inputField: VNode[]): VNode[];

    /** @param {VNode[]} formGroups */
    createCard(formGroups: VNode[]): VNode[];

    /** @param {String} subject */
    createButton(subject: string): VNode;

    /** @param {VNode[]} cards */
    createForm(cards: VNode, emitter: function): VNode;
}

/**
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('vue').VNodeChildren} VNodeChildren
 *
 * @typedef {import('vue').Component} Component
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 * @typedef {import('./basecreator').BaseCreator} BaseCreator
 *
 * @typedef {(value:string) => string} FormGroupFormatter
 *
 * @typedef {Object} FormInputData
 * @property {string} cardHeader the header of the card
 * @property {FormGroup[]} formGroups the formgroups the form consits of
 *
 * @typedef {Object} FormGroup the formgroups the form consits of
 * @property {string} property the property of the formgroup
 * @property {string} label the label of the formgroup
 * @property {string} type the type of the formgroup
 * @property {FormGroupFormatter} [formatter] the formatter for the value in the formgroup input
 * @property {string} [options] the options in the 'select' or 'multiselect' type formgroup has
 * @property {string} [valueField] the valueField in the 'select' or 'multiselect' type formgroup has
 * @property {string} [textField] the textField in the 'select' or 'multiselect' type formgroup has
 * @property {number} [min] the minimal value a number in the 'number' type formgroup has
 * @property {number} [max] the maximal value a number in the 'number' type formgroup has
 * @property {number} [step] the step value a number in the 'number' type formgroup has
 * @property {[string,string]} [description] the descriptions(options) a checkbox should have
 * @property {Component} [component] the component the formgroup should use
 */

import StringInput from '../components/inputs/String';
import SelectInput from '../components/inputs/Select';
import MultiselectInput from '../components/inputs/Multiselect';
import NumberInput from '../components/inputs/Number';
import CheckboxInput from '../components/inputs/Checkbox';
import BaseFormError from '../components/FormError';

import {InvalidFormTypeGivenError} from '../errors/InvalidFormTypeGivenError';

export class FormCreator {
    /**
     * @param {TranslatorService} translatorService
     * @param {BaseCreator} baseCreator
     */
    constructor(baseCreator, translatorService) {
        /** @type {CreateElement} */
        this._h;
        this._translatorService = translatorService;
        this._baseCreator = baseCreator;
    }

    // prettier-ignore
    /** @param {CreateElement} h */
    set h(h) { this._h = h; }

    /**
     * Generate a form
     * @param {String} subject the subject for which to create something for
     * @param {FormInputData[]} formData the data the form consists of
     */
    create(subject, formData) {
        // define formCreator here, cause this context get's lost in the return object
        const formCreator = this;

        return {
            name: `${subject}-form`,

            functional: true,

            props: {
                editable: {
                    type: Object,
                    required: true,
                },
                errors: {
                    type: Object,
                    required: true,
                },
            },

            render(_, {props, listeners}) {
                const cards = formData.map(data => {
                    const cardData = [];

                    if (data.cardHeader) cardData.push(formCreator._baseCreator.title(data.cardHeader, 'h3'));

                    const formGroups = data.formGroups.map(formGroup => {
                        const input = [formCreator.typeConverter(formGroup, props.editable)];

                        if (props.errors[formGroup.property]) {
                            input.push(formCreator.createError(props.errors[formGroup.property][0]));
                        }

                        return formCreator.createFormGroup(formGroup.label, input);
                    });

                    cardData.push(formGroups);

                    return formCreator._baseCreator.card(cardData);
                });

                cards.push(formCreator.submitButton(subject));
                return formCreator.createForm(cards, () => listeners.submit());
            },
        };
    }

    /**
     * Generate an input
     * @param {FormGroup} inputData the data used to generate an input field
     * @param {Object<string, any>} editable the editable property of the form
     */
    typeConverter(inputData, editable) {
        const valueBinding = {
            props: {value: editable[inputData.property]},
            on: {update: e => (editable[inputData.property] = e)},
        };

        switch (inputData.type) {
            case 'string':
                return this._h(
                    StringInput(inputData.placeholder || `Vul hier uw ${inputData.label.toLowerCase()} in`, false),
                    valueBinding
                );
            case 'select':
                return this._h(SelectInput(inputData.options, inputData.valueField, inputData.textField), valueBinding);
            case 'number':
                return this._h(
                    NumberInput(inputData.min, inputData.max, inputData.step, inputData.formatter),
                    valueBinding
                );
            case 'checkbox':
                return this._h(CheckboxInput(inputData.description), valueBinding);
            case 'multiselect':
                return this._h(
                    MultiselectInput(inputData.options, inputData.valueField, inputData.textField),
                    valueBinding
                );
            case 'custom':
                return this._h(inputData.component, valueBinding);
        }

        throw new InvalidFormTypeGivenError(
            `Invalid type for ${inputData.property}, type can be 'string', 'select', 'number', 'checkbox', 'multiselect', 'custom'`
        );
    }

    /** @param {String} property */
    createError(property) {
        return this._h(BaseFormError, {props: {error: property}});
    }

    /**
     * @param {String} label
     * @param {VNodeChildren} inputField
     */
    createFormGroup(label, inputField) {
        const labelAndInput = [
            this._h('legend', {class: 'col-sm-3 bv-no-focus-ring col-form-label'}, [label]),
            this._h('div', {class: 'bv-no-focus-ring col'}, inputField),
        ];

        return this._h(
            'fieldset',
            {
                class: 'form-group',
                on: {
                    click: _ => {
                        if (inputField[0].componentInstance && inputField[0].componentInstance.focus) {
                            inputField[0].componentInstance.focus();
                        } else if (inputField[0].elm) {
                            inputField[0].elm.focus();
                        } else {
                            // TODO :: check how everything is focusable
                            console.log(inputField[0]);
                        }
                    },
                },
            },
            [this._h('div', {class: 'form-row'}, labelAndInput)]
        );
    }

    /** @param {String} subject */
    submitButton(subject) {
        return this._h(
            'button',
            {type: 'submit', class: 'btn btn-primary'},
            this._translatorService.getCapitalizedSingular(subject) + ' opslaan'
        );
    }

    /** @param {VNode[]} cards */
    createForm(cards, emitter) {
        return this._h(
            'form',
            {
                on: {
                    submit: e => {
                        e.preventDefault();
                        emitter();
                    },
                },
            },
            cards
        );
    }
}

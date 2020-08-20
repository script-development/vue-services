/**
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('vue').Component} Component
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 *
 * @typedef {Object} FormData
 * @property {string} cardHeader the header of the card
 * @property {FormGroup[]} formGroups the formgroups the form consits of
 *
 * @typedef {Object} FormGroup the formgroups the form consits of
 * @property {string} property the property of the formgroup
 * @property {string} label the label of the formgroup
 * @property {string} type the type of the formgroup
 * @property {string} [options] the options in the 'select' or 'multiselect' type formgroup has
 * @property {string} [valueField] the valueField in the 'select' or 'multiselect' type formgroup has
 * @property {string} [textField] the textField in the 'select' or 'multiselect' type formgroup has
 * @property {string} [min] the minimal value a number in the 'numer' type formgroup has
 * @property {string} [max] the maximal value a number in the 'numer' type formgroup has
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
     */
    constructor(translatorService) {
        /** @type {CreateElement} */
        this._h;
        this._translatorService = translatorService;
    }

    // prettier-ignore
    /** @param {CreateElement} h */
    set h(h) { this._h = h; }

    /**
     * Generate a form
     * @param {String} subject the subject for which to create something for
     * @param {FormData[]} formData the data the form consists of
     */
    create(subject, formData) {
        // define formCreator here, cause this context get's lost in the return object
        const formCreator = this;

        return {
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

            render() {
                const card = formData.map(data => {
                    const cardData = [];

                    if (data.cardHeader) cardData.push(formCreator.createTitle(data.cardHeader));

                    const formGroups = data.formGroups.map(formGroup => {
                        const input = [formCreator.typeConverter(formGroup, this.editable)];

                        if (this.errors[formGroup.property])
                            input.push(formCreator.createError(this.errors[formGroup.property][0]));

                        return formCreator.createFormGroup(formGroup.label, input);
                    });

                    cardData.push(formGroups);

                    return formCreator.createCard(cardData);
                });

                card.push(formCreator.createButton(subject));
                return formCreator.createForm(card, () => this.$emit('submit'));
            },
        };
    }

    /**
     * Generate an input
     * @param {FormGroup} inputData the data used to generate an input field
     * @param {Object<string>} editable the editable property of the form
     */
    typeConverter(inputData, editable) {
        const valueBinding = {
            props: {value: editable[inputData.property]},
            on: {update: e => (editable[inputData.property] = e)},
        };

        switch (inputData.type) {
            case 'string':
                return this._h(StringInput(`Vul hier uw ${inputData.label.toLowerCase()} in`, false), valueBinding);
            case 'select':
                return this._h(SelectInput(inputData.options, inputData.valueField, inputData.textField), valueBinding);
            case 'number':
                return this._h(NumberInput(inputData.min, inputData.max), valueBinding);
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

    /** @param {String} title */
    createTitle(title) {
        return this._h('h3', title);
    }

    /** @param {String} property */
    createError(property) {
        return this._h(BaseFormError, {props: {error: property}});
    }

    /**
     * @param {String} label
     * @param {VNode[]} inputField
     */
    createFormGroup(label, inputField) {
        const labelAndInput = [
            this._h('legend', {tabindex: '-1', class: 'col-sm-3 bv-no-focus-ring col-form-label'}, label),
        ];
        labelAndInput.push(this._h('div', {tabindex: '-1', role: 'group', class: 'bv-no-focus-ring col'}, inputField));
        const formRow = this._h('div', {class: 'form-row'}, [labelAndInput]);
        return this._h('fieldset', {class: 'form-group'}, [formRow]);
    }

    /** @param {VNode[]} formGroups */
    createCard(formGroups) {
        const cardBody = this._h('div', {class: 'card-body'}, formGroups);
        return this._h('div', {class: 'card mb-2'}, [cardBody]);
    }

    /** @param {String} subject */
    createButton(subject) {
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

/**
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNode} VNode
 * @typedef {import('../services/translator').TranslatorService} TranslatorService
 */
import StringInput from '../components/inputs/String';
import SelectInput from '../components/inputs/Select';
import MultiselectInput from '../components/inputs/Multiselect';
import NumberInput from '../components/inputs/Number';
import CheckboxInput from '../components/inputs/Checkbox';
import BaseFormError from '../components/FormError';

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

    // TODO :: @Methox define formData, cause it can have a defined set of properties
    /**
     * Generate a form
     * @param {String} subject the subject for which to create something for
     * @param {Array} formData the data the form consists of
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

                    if (data.header) cardData.push(formCreator.createTitle(data.header));

                    // TODO :: @Methox children may not be the best naming here, maybe formGroups?
                    const formGroups = data.children.map(child => {
                        const input = [formCreator.typeConverter(child, this.editable)];

                        if (this.errors[child.property])
                            input.push(formCreator.createError(this.errors[child.property][0]));

                        return formCreator.createFormGroup(child.label, input);
                    });

                    cardData.push(formGroups);

                    return formCreator.createCard(cardData);
                });

                card.push(formCreator.createButton(subject));
                return formCreator.createForm(card, () => this.$emit('submit'));
            },
        };
    }

    // TODO :: @Methox documentation
    typeConverter(childData, editable) {
        const valueBinding = {
            props: {value: editable[childData.property]},
            on: {update: e => (editable[childData.property] = e)},
        };

        switch (childData.type) {
            case 'string':
                return this._h(StringInput(`Vul hier uw ${childData.label.toLowerCase()} in`, false), valueBinding);
            case 'select':
                return this._h(SelectInput(childData.options, childData.valueField, childData.textField), valueBinding);
            case 'number':
                return this._h(NumberInput(childData.min, childData.max), valueBinding);
            case 'checkbox':
                return this._h(CheckboxInput(childData.description), valueBinding);
            case 'multiselect':
                return this._h(
                    MultiselectInput(childData.options, childData.valueField, childData.textField),
                    valueBinding
                );
            case 'custom':
                return this._h(childData.component, valueBinding);
        }

        // TODO :: @Methox create custom error for this
        console.warn(
            `Invalid type for ${childData.property}, type can be 'string', 'select', 'number', 'checkbox', 'multiselect', 'custom'`
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
     * @param {VNode[]} children
     */
    createFormGroup(label, children) {
        // TODO :: @Methox is it possible to not use b-form-group but the actual element it translates to?
        return this._h('b-form-group', {props: {labelColsSm: '3', label: label}}, children);
    }

    /** @param {VNode[]} children */
    createCard(children) {
        // TODO :: @Methox is it possible to not use b-card but the actual element it translates to?
        return this._h('b-card', {class: 'mb-2'}, children);
    }

    /** @param {String} subject */
    createButton(subject) {
        // TODO :: @Methox is it possible to not use b-button but the actual element it translates to?
        return this._h(
            'b-button',
            {props: {type: 'submit', variant: 'primary'}},
            this._translatorService.getCapitalizedSingular(subject) + ' opslaan'
        );
    }

    /** @param {VNode[]} children */
    createForm(children, emitter) {
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
            children
        );
    }
}

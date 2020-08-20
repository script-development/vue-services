import Vue from 'vue';
import {storeService} from '../../services';
/**
 * Creates a select input for a create and edit form
 *
 * @param {String}          storeGetter     The getter for the options for the multiselect
 * @param {String}          valueField      The property of an option object that's used as the value for the option
 * @param {String}          textField       The property of an option object that will be shown to the user
 * @param {Boolean}         editable        If the property is editable
 *
 * @returns {VueComponent}
 */
export default (moduleName, valueField, textField) =>
    Vue.component('select-input', {
        computed: {
            options() {
                return storeService.getAllFromStore(moduleName);
            },
        },
        props: {value: {required: true, type: Number}},
        render(h) {
            return h('b-select', {
                props: {
                    value: this.value,
                    valueField: valueField,
                    textField: textField,
                    options: this.options,
                },
                on: {input: event => this.$emit('update', event)},
            });
        },
    });

import Vue from 'vue';
import {storeService} from '../../services';

let Multiselect;

try {
    Multiselect = require('vue-multiselect').default;
    // eslint-disable-next-line
} catch (error) {}

/**
 * Creates a multiselect for a create and edit form
 *
 * @param {String}    storeGetter     The getter for the options for the multiselect
 * @param {string}    valueField      The property of an option object that's used as the value for the option
 * @param {string}    textField       The property of an option object that will be shown to the user
 *
 * @returns {VueComponent}
 */
export default (moduleName, valueField, textField) =>
    Vue.component('multiselect-input', {
        props: {value: {required: true, type: Array}},
        computed: {
            options() {
                return storeService.getAllFromStore(moduleName);
            },
        },
        render(h) {
            if (!Multiselect) {
                console.error('VUE-MULTISELECT IS NOT INSTALLED');
                console.warn('run the following command to install vue-multiselect: npm --save vue-multiselect');
                return h('p', 'VUE-MULTISELECT IS NOT INSTALLED');
            }
            return h(Multiselect, {
                props: {
                    trackBy: valueField,
                    label: textField,
                    options: this.options,
                    value: this.options.filter(item => this.value.includes(item[valueField])),
                    placeholder: 'zoeken',
                    multiple: true,
                    clearOnSelect: false,
                    preserveSearch: true,
                    showLabels: false,
                    showPointer: false,
                    closeOnSelect: false,
                },
                on: {
                    input: e =>
                        this.$emit(
                            'update',
                            e.map(item => item[valueField])
                        ),
                },
            });
        },
    });

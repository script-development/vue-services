import { storeService } from '../../services/index';
/**
 * Creates a select input for a create and edit form
 *
 * @param {String}          storeGetter     The getter for the options for the multiselect
 * @param {String}          valueField      The property of an option object that's used as the value for the option
 * @param {String}          textField       The property of an option object that will be shown to the user
 *
 * @returns {VueComponent}
 */
export default (moduleName, valueField, textField) => ({
    name: 'select-input',
    computed: {
        options() {
            return storeService.getAllFromStore(moduleName);
        },
    },
    props: { value: { required: true, type: Number } },
    render(h) {
        const options = this.options.map(option =>
            h('option', { attrs: { value: option[valueField], selected: option[valueField] == this.value } }, [
                option[textField],
            ])
        );
        return h(
            'select',
            { class: 'custom-select', on: { input: e => this.$emit('update', parseInt(e.target.value)) } },
            options
        );
    },
});

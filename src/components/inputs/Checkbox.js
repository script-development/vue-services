import Vue from 'vue';

/**
 * Creates a checkbox for a create and edit form
 *
 * @param {String[]} description The description being show when checkbox is checked and not checked, first value in array is checked, second is not checked
 *
 * @returns {VueComponent}
 */
export default description =>
    Vue.component('checkbox-input', {
        functional: true,
        props: {value: {required: true, type: Boolean}},
        render(h, {props, listeners}) {
            return h(
                'b-checkbox',
                {props: {checked: props.value, required: true}, on: {input: e => listeners.update(e)}},
                [description[props.value ? 1 : 0]]
            );
        },
    });

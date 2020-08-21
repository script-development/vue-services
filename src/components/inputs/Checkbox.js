/**
 * Creates a checkbox for a create and edit form
 *
 * @param {String[]} description The description being show when checkbox is checked and not checked, first value in array is checked, second is not checked
 *
 * @returns {VueComponent}
 */
export default description => ({
    name: 'checkbox-input',
    functional: true,
    props: {value: {required: true, type: Boolean}},
    render(h, {props, listeners}) {
        // TODO :: create normal element instead of Bootstrap Vue element
        return h(
            'b-checkbox',
            {props: {checked: props.value, required: true, switch: true}, on: {input: e => listeners.update(e)}},
            [description[props.value ? 1 : 0]]
        );
    },
});

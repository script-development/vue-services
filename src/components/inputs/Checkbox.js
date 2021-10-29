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
        return h(
            'input',
            {attrs: {type:"checkbox"}, props: {checked: props.value, required: true, value: true}, on: {input: e => listeners.update(e.srcElement.checked)}},
            [description[props.value ? 1 : 0]]
        );
    },
});

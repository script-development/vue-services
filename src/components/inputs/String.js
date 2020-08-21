let updateTimeout;

const update = (emitter, url, value) => {
    if (updateTimeout) clearTimeout(updateTimeout);
    if (url && !value.indexOf('http://') == 0 && !value.indexOf('https://') == 0) {
        value = `http://${value}`;
    }
    updateTimeout = setTimeout(() => emitter(value), 200);
};

/**
 * Creates a text input for a create and edit form
 *
 * @param {String}  placeholder The placeholder being shown when there is no input
 * @param {Boolean} url         If the input needs to be a url or not
 *
 * @returns {VueComponent}
 */
export default (placeholder, url) => ({
    name: 'string-input',
    functional: true,
    props: {value: {required: true, type: String}},
    render(h, {props, listeners}) {
        return h('input', {
            class: 'form-control',
            attrs: {value: props.value, placeholder},
            on: {input: e => update(listeners.update, url, e.target.value)},
        });
    },
});

import Vue from 'vue';

let updateTimeout;

const update = (emitter, value) => {
    if (updateTimeout) clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        // Check if it's a float or an int
        if (value.indexOf('.') !== -1) emitter(parseFloat(value));
        else emitter(parseInt(value));
    }, 200);
};

/**
 * Creates a number input for a create and edit form
 *
 * @param {Number}      [min]         The minimum amount
 * @param {Number}      [max]         The maximum amount
 * @param {Number}      [steps]       The steps amount, default 1
 * @param {Function}    [formatter]   Optional formatter
 *
 * @returns {VueComponent}
 */
export default (min, max, step = 1, formatter) => {
    const functional = !formatter;
    return Vue.component('number-input', {
        // can be functional when it's just a number without a formatter
        // maybe not the most practical/readable solution, but it's a proof of concept that it can work
        functional,
        props: {value: {required: true, type: Number}},
        data() {
            return {
                isInputActive: false,
            };
        },
        render(h, context) {
            // TODO Vue3 :: make this pretty again, put it in setup
            // could also still be just a functional component then, requires testing
            let value, updater;
            // render get's context when it's a functional component
            if (functional) {
                value = context.props.value;
                updater = context.listeners.update;
            } else {
                value = this.value;
                updater = this.$listeners.update;
            }

            if (functional || this.isInputActive) {
                return h('input', {
                    class: 'form-control',
                    attrs: {
                        value,
                        type: 'number',
                        min,
                        max,
                        step,
                    },
                    on: {
                        input: e => {
                            if (!e.target.value) e.target.value = '0';

                            update(updater, e.target.value);
                        },
                        blur: () => {
                            if (!functional) this.isInputActive = false;
                        },
                    },
                });
            } else {
                return h('input', {
                    class: 'form-control',
                    attrs: {value: formatter(value), type: 'text'},
                    on: {focus: () => (this.isInputActive = true)},
                });
            }
        },
    });
};

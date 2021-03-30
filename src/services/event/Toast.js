import {defineComponent, h} from 'vue';

const VARIANTS = [
    'danger',
    'success',
    'primary',
    'secondary',
    'warning',
    'info',
    'light',
    'dark',
    'white',
    'transparent',
];

/** @param {string} variant */
const validVariant = variant => VARIANTS.includes(variant);

export const ToastComponent = defineComponent({
    props: {
        message: {type: String, required: true},
        show: {type: Boolean, required: true},
        variant: {type: String, required: false, default: 'success', validator: validVariant},
    },
    emits: ['hide'],
    setup: (props, {emit}) => {
        const closeButton = h('button', {
            class: 'btn-close m-auto me-2',
            onclick: () => {
                if (props.show) emit('hide');
            },
        });

        const headerElement = h('div', {class: 'toast-header border-bottom-0'}, [closeButton]);

        const bodyElement = h('div', {class: 'toast-body', style: 'background-color: rgba(255,255,255,.50)'}, [
            props.message,
        ]);

        const variant = `bg-${props.variant}`;

        return () => {
            // need to define classes here, to make it reactive when props.show changes
            const classes = ['toast', variant, props.show ? 'show' : 'hide'];
            return h('div', {class: classes, style: 'z-index:9999;'}, [headerElement, bodyElement]);
        };
    },
});

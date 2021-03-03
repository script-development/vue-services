import {defineComponent, h} from 'vue';

/**
 * Extra toast styling, for the animations
 */
const style = document.createElement('style');
document.head.appendChild(style);

if (style.sheet) {
    style.sheet.insertRule('.show-toast {animation: fadein 0.5s;}');
    style.sheet.insertRule('.hide-toast {animation: fadeout 0.5s;}');
    style.sheet.insertRule(`@keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;}}`);
    style.sheet.insertRule(`@keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }`);
}

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
            class: 'btn-close ml-auto mr-2',
            onclick: () => {
                if (props.show) emit('hide');
            },
        });

        const messageElement = h('div', {class: 'toast-body'}, [props.message]);

        const variant = `bg-${props.variant}`;

        return () => {
            // need to define classes here, to make it reactive when props.show changes
            const classes = [
                'toast d-flex align-items-center border-0',
                variant,
                props.show ? 'show-toast' : 'hide-toast',
            ];
            return h('div', {class: classes, style: {opacity: 1}}, [messageElement, closeButton]);
        };
    },
});

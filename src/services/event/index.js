/**
 * @typedef {import("vue").App} App
 *
 * @typedef {import("../../../types/types").ToastMessages} ToastMessages
 * @typedef {import("../../../types/types").ToastMessage} ToastMessage
 * @typedef {import("../../../types/types").ToastVariant} ToastVariant
 * @typedef {import("../../../types/types").Modals} Modals
 * @typedef {import("../../../types/types").Modal} Modal
 * @typedef {import("../../../types/types").ResponseMiddleware} ResponseMiddleware
 * @typedef {import("../../../types/types").ResponseErrorMiddleware} ResponseErrorMiddleware
 */

import {createApp, defineComponent, h, ref} from 'vue';
import {registerResponseErrorMiddleware, registerResponseMiddleware} from '../http';
import {ToastComponent} from './Toast';
import {ModalComponent} from './Modal';

/** @type {ToastMessages} */
const toastMessages = ref([]);
/** @type {Modals} */
const modals = ref([]);

/**
 * The default duration for a toast message.
 * Can be overwritten.
 */
export let defaultToastMessageDuration = 1500;

/**
 * Hide the toast message after a timeout and delete it from toastMessages
 * @param {ToastMessage} message
 */
const hideToastMessage = message => {
    if (message.timeoutId) clearTimeout(message.timeoutId);

    // TODO :: because this is called from render the ref becomes itself
    // and it's being called from the render function and outside the render function
    if (message.show.value) message.show.value = false;
    // @ts-ignore, see TODO above
    else if (message.show) message.show = false;

    message.timeoutId = setTimeout(() => {
        const index = toastMessages.value.findIndex(t => t.message === message.message);
        toastMessages.value.splice(index, 1);
    }, 450);
};

/**
 * Hide the toast message after the given duration
 *
 * @param {ToastMessage} message the message to remove after the delay
 */
const hideToastMessageAfterDelay = message => {
    if (message.timeoutId) clearTimeout(message.timeoutId);
    message.timeoutId = setTimeout(() => hideToastMessage(message), message.duration);
};

const eventApp = defineComponent({
    render() {
        if (modals.value.length) document.body.classList.add('modal-open');
        else document.body.classList.remove('modal-open');
        return [
            toastMessages.value.map(message => {
                return h(ToastComponent, {
                    message: message.message,
                    show: message.show,
                    variant: message.variant,
                    onHide: () => hideToastMessage(message),
                    // TODO :: what if there are two of the same messages active?
                    // this will trow error
                    key: message.message,
                });
            }),
            modals.value.map((modal, index) => {
                return h(ModalComponent, {
                    ...modal,
                    onClose: () => modals.value.splice(index, 1),
                });
            }),
        ];
    },
});

const eventContainer = document.createElement('div');
document.body.appendChild(eventContainer);
createApp(eventApp).mount(eventContainer);

/**
 * Create a toast message
 *
 * @param {string} message the message to show
 * @param {ToastVariant} [variant] the variant of the toast, default = success
 * @param {number} [duration] the duration the toast stays visisble, default = defaultToastMessageDuration
 */
export const createToastMessage = (message, variant = 'success', duration = defaultToastMessageDuration) => {
    const toastMessage = {message, variant, duration, show: ref(true)};
    hideToastMessageAfterDelay(toastMessage);
    toastMessages.value.push(toastMessage);
};

/** @type {ResponseMiddleware} */
export const responseMiddleware = ({data}) => {
    if (data && data.message) createToastMessage(data.message);
};

registerResponseMiddleware(responseMiddleware);

/** @type {ResponseErrorMiddleware} */
export const responseErrorMiddleware = ({response}) => {
    if (response && response.data.message) createToastMessage(response.data.message, 'danger');
};

registerResponseErrorMiddleware(responseErrorMiddleware);

/**
 *
 * @param {Modal} modal
 */
export const createModal = modal => modals.value.push(modal);

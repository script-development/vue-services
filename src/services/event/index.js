/**
 * @typedef {import("vue").App} App
 * @typedef {import("../../../types/types").ToastMessages} ToastMessages
 * @typedef {import("../../../types/types").ToastMessage} ToastMessage
 * @typedef {import("../../../types/types").ToastVariant} ToastVariant
 */

import {createApp, defineComponent, h, ref} from 'vue';
import {ToastComponent} from './Toast';

const style = document.createElement('style');
document.head.appendChild(style);

style.sheet.insertRule('.show-toast {animation: fadein 0.5s;}');
style.sheet.insertRule('.hide-toast {animation: fadeout 0.5s;}');
style.sheet.insertRule(`@keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;}}`);
style.sheet.insertRule(`@keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }`);

/** @type {ToastMessages} */
const toastMessages = ref([]);
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
    clearTimeout(message.timeoutId);

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
    clearTimeout(message.timeoutId);
    message.timeoutId = setTimeout(() => hideToastMessage(message), message.duration);
};

const eventApp = defineComponent({
    render() {
        return toastMessages.value.map(message => {
            return h(ToastComponent, {
                message: message.message,
                show: message.show,
                onHide: () => hideToastMessage(message),
                // TODO :: what if there are two of the same messages active?
                // this will trow error
                key: message.message,
            });
        });
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

// export class EventService {
//     /**
//      *
//      * @param {HTTPService} httpService the http service for communication with the API
//      */
//     constructor(httpService) {
//         this._app;
//         this._httpService = httpService;

//         this._httpService.registerResponseMiddleware(this.responseMiddleware);
//         this._httpService.registerResponseErrorMiddleware(this.responseErrorMiddleware);
//     }

//     // prettier-ignore
//     /** @returns {App} */
//     get app() { return this._app; }

//     set app(app) {
//         // if (!app.$bvToast) {
//         //     Vue.use(ToastPlugin);
//         // }

//         // if (!app.$bvModal) {
//         //     Vue.user(ModalPlugin);
//         // }
//         this._app = app;
//     }

//     /** @returns {ResponseMiddleware} */
//     get responseMiddleware() {
//         return ({data}) => {
//             if (data && data.message) this.successToast(data.message);
//         };
//     }

//     /** @returns {ResponseErrorMiddleware} */
//     get responseErrorMiddleware() {
//         return ({response}) => {
//             if (response && response.data.message) this.dangerToast(response.data.message);
//         };
//     }

//     /**
//      * pops up a toast with given message in the given variance
//      * @param {String} message the message being shown by the toast
//      * @param {String} variant the toast variant
//      */
//     toast(message, variant) {
//         // TODO :: vue-3 :: make toast great again
//         console.log('TOAST', message, variant);
//         // this._app.$bvToast.toast(`${message}`, {
//         //     variant,
//         //     solid: true,
//         //     toaster: 'b-toaster-bottom-left',
//         // });
//     }

//     /**
//      * pops up a success toast
//      * @param {String} message the message being shown by the toast
//      */
//     successToast(message) {
//         this.toast(message, 'success');
//     }

//     /**
//      * pops up a danger toast
//      * @param {String} message the message being shown by the toast
//      */
//     dangerToast(message) {
//         this.toast(message, 'danger');
//     }

//     /**
//      * pops up a modal with the given message
//      * @param {String} message the message being shown by the modal
//      * @param {Function} okAction the function being used when click on ok
//      * @param {Function} [cancelAction] the being used when click on cancel
//      */
//     modal(message, okAction, cancelAction) {
//         // TODO :: vue-3 :: make modal great again
//         console.log('MODAL', message, okAction, cancelAction);
//         // this._app.$bvModal
//         //     .msgBoxConfirm(message, {
//         //         size: 'm',
//         //         buttonSize: 'm',
//         //         okVariant: 'primary',
//         //         okTitle: 'Ja',
//         //         cancelTitle: 'Nee',
//         //         headerClass: 'p-2',
//         //         footerClass: 'p-2 confirm',
//         //         hideHeaderClose: true,
//         //         centered: true,
//         //     })
//         //     .then(value => {
//         //         if (value && okAction) okAction();
//         //         else if (cancelAction) cancelAction();
//         //     });
//     }
// }

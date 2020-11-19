/**
 * @typedef {import("vue").App} App
 */

import {createApp, defineComponent, h, ref} from 'vue';

const style = document.createElement('style');
document.head.appendChild(style);

style.sheet.insertRule('.show-toast {animation: fadein 0.5s;}');
style.sheet.insertRule('.hide-toast {animation: fadeout 0.5s;}');
style.sheet.insertRule(`@keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;}}`);
style.sheet.insertRule(`@keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }`);

const toasty = document.createElement('div');
document.body.appendChild(toasty);

const toastCss = ref({
    visibility: 'visisble',
    'min-width': '250px',
    'margin-left': '-125px',
    'background-color': '#333',
    color: '#fff',
    'text-align': 'center',
    'border-radius': '2px',
    padding: '16px',
    position: 'fixed',
    'z-index': '1',
    left: '50%',
    bottom: '30px',
});

const toastMessages = ref(['asd']);

const toastElement = defineComponent({
    props: {
        message: {type: String, required: true},
        index: {type: Number, required: true},
    },
    setup(props) {
        const show = ref(true);
        return () =>
            h('div', {style: toastCss.value, class: show.value ? 'show-toast' : 'hide-toast'}, [
                h('span', [props.message]),
                h(
                    'button',
                    {
                        onclick: () => {
                            show.value = false;
                            setTimeout(() => toastMessages.value.splice(props.index, 1), 490);
                        },
                    },
                    ['X']
                ),
            ]);
    },
});

const toastTemplate = defineComponent({
    props: {
        variant: {
            type: String,
            required: false,
            default: 'success',
        },
    },
    render() {
        return toastMessages.value.map((message, index) => h(toastElement, {message, index}));
    },
});

createApp(toastTemplate).mount(toasty);

export const createToastMessage = (message, variant) => {
    toastMessages.value.push(message);
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

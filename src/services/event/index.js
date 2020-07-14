/**
 * @typedef {import("vue/types/vue").Vue} VueInstance
 * @typedef {import('../http').HTTPService} HTTPService
 */

//  TODO :: it's BootstrapVue dependent
export class EventService {
    /**
     *
     * @param {HTTPService} httpService the http service for communication with the API
     */
    constructor(httpService) {
        this._app;
        this._httpService = httpService;

        this._httpService.registerResponseMiddleware(this.responseMiddleware);
        this._httpService.registerResponseErrorMiddleware(this.responseErrorMiddleware);
    }

    /** @returns {VueInstance} */
    get app() {
        return this._app;
    }

    set app(app) {
        this._app = app;
    }

    get responseMiddleware() {
        return ({data}) => {
            if (data && data.message) this.successToast(data.message);
        };
    }

    get responseErrorMiddleware() {
        return ({response}) => {
            if (response && response.data.message) this.dangerToast(response.data.message);
        };
    }

    /**
     * pops up a toast with given message in the given variance
     * @param {String} message the message being shown by the toast
     * @param {String} variant the toast variant
     */
    toast(message, variant) {
        this._app.$bvToast.toast(`${message}`, {
            variant,
            solid: true,
            toaster: 'b-toaster-bottom-left',
        });
    }

    /**
     * pops up a success toast
     * @param {String} message the message being shown by the toast
     */
    successToast(message) {
        this.toast(message, 'success');
    }

    /**
     * pops up a danger toast
     * @param {String} message the message being shown by the toast
     */
    dangerToast(message) {
        this.toast(message, 'danger');
    }

    /**
     * pops up a modal with the given message
     * @param {String} message the message being shown by the modal
     * @param {Function} okAction the function being used when click on ok
     * @param {Function} [cancelAction] the being used when click on cancel
     */
    modal(message, okAction, cancelAction) {
        this._app.$bvModal
            .msgBoxConfirm(message, {
                size: 'm',
                buttonSize: 'm',
                okVariant: 'primary',
                okTitle: 'Ja',
                cancelTitle: 'Nee',
                headerClass: 'p-2',
                footerClass: 'p-2 confirm',
                hideHeaderClose: true,
                centered: true,
            })
            .then(value => {
                if (value && okAction) okAction();
                else if (cancelAction) cancelAction();
            });
    }
}

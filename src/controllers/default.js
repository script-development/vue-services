/**
 * @typedef {import('@script-development/vue-services').Translation} Translation
 */
import {BaseController} from '@script-development/vue-services';

const API_ENDPOINT = 'FILL_IN';

export class FILL_INController extends BaseController {
    constructor() {
        /** @type {Translation} */
        const translation = {
            singular: 'FILL_IN',
            plural: 'FILL_IN',
        };
        super(API_ENDPOINT, translation);

        // if you want to add new actions to the store you can use the following methods:
        // this.createAndSetExtraGetAction('action name', AxiosRequestConfig)
        // this.createAndSetExtraPostAction('action name')

        // if you want to add extra mutators you can use the following methods:
        // this.setExtraStoreMutation('mutation name', MutationMethod)
    }

    get overviewPage() {
        console.warn('Implement this');
        return false;
    }

    get createPage() {
        console.warn('Implement this');
        return false;
    }

    get showPage() {
        console.warn('Implement this');
        return false;
    }

    get editPage() {
        console.warn('Implement this');
        return false;
    }
}

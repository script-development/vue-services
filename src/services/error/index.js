/**
 * @typedef {import('vue-router').NavigationHookAfter} NavigationHookAfter
 *
 * @typedef {import('../../../types/types').ResponseErrorMiddleware} ResponseErrorMiddleware
 * @typedef {import('../../../types/types').ErrorBagRef} ErrorBagRef
 */
import {defineComponent, h, ref} from 'vue';
import NotFoundPage from '../../pages/errors/404';
import {registerResponseErrorMiddleware} from '../http';
import {addRoute, registerAfterMiddleware} from '../router';

/** @type {ErrorBagRef} */
const errors = ref({});

addRoute({
    path: '/:pathMatch(.*)*',
    name: 'not.found',
    component: NotFoundPage,
    meta: {title: 'Pagina niet gevonden', auth: true},
});

/** @type {NavigationHookAfter} */
export const routeMiddleware = () => (errors.value = {});
registerAfterMiddleware(routeMiddleware);

/** @type {ResponseErrorMiddleware} */
export const responseErrorMiddleware = ({response}) => {
    if (response && response.data.errors) errors.value = response.data.errors;
};
registerResponseErrorMiddleware(responseErrorMiddleware);

export const BaseFormError = defineComponent({
    props: {property: {type: String, required: true}},
    setup(props) {
        return () => {
            if (!errors.value[props.property]) return;
            return h('div', {class: 'invalid-feedback d-block'}, [errors.value[props.property][0]]);
        };
    },
});

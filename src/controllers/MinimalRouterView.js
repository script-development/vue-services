import {defineComponent, h} from 'vue';
import {} from 'vue-router';
import {getCurrentRoute} from '../services/router';

const name = 'default';

export default defineComponent({
    name: 'MinimalRouterView',
    functional: true,
    props: {
        depth: {
            type: Number,
            default: 0,
        },
    },
    setup(props) {
        const matched = getCurrentRoute().value.matched[props.depth];
        const component = matched && matched.components[name];

        // render empty node if no matched route or no config component
        if (!matched || !component) {
            return () => h('div', [404]);
        }
        return () => h(component);
    },
});

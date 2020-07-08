const name = 'default';

export default {
    name: 'MinimalRouterView',
    functional: true,
    props: {
        depth: {
            type: Number,
            default: 0,
        },
    },
    render(h, {
        props,
        children,
        parent,
        data
    }) {
        const route = parent.$route;
        const matched = route.matched[props.depth];
        const component = matched && matched.components[name];

        // render empty node if no matched route or no config component
        if (!matched || !component) {
            return h();
        }
        return h(component, data, children);
    },
};

export default {
    name: 'form-error',
    functional: true,
    props: {
        error: {
            type: String,
            required: true,
        },
    },
    render(h, {props}) {
        if (!props.error) return;
        return h(
            'b-form-invalid-feedback',
            {
                props: {
                    state: false,
                },
            },
            [props.error]
        );
    },
};

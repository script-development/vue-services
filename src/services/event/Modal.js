import {defineComponent, h} from 'vue';

/* The Modal (background) CSS */
const modalOverlayCSS = {
    position: 'fixed' /* Stay in place */,
    'z-index': 1 /* Sit on top */,
    left: 0,
    top: 0,
    width: '100%' /* Full width */,
    height: '100%' /* Full height */,
    overflow: 'auto' /* Enable scroll if needed */,
    'background-color': 'rgba(0,0,0,0.4)' /* Black w/ opacity */,
};

const modalContentCSS = {
    'background-color': '#fefefe',
    margin: '15% auto' /* 15% from the top and centered */,
    padding: '20px',
    border: '1px solid #888',
    width: '80%' /* Could be more or less, depending on screen size */,
};

export const ModalComponent = defineComponent({
    props: {
        id: {
            type: String,
            required: false,
        },

        title: {
            type: String,
            required: false,
        },
        titleTag: {
            type: String,
            required: false,
            default: 'h5',
        },
        titleClass: {
            type: Array,
            required: false,
        },

        message: {
            type: String,
            required: false,
        },

        // TODO :: could use translations to default this
        okTitle: {
            type: String,
            required: false,
            default: 'Ok',
        },
        okAction: {
            type: Function,
            required: true,
        },

        cancelTitle: {
            type: String,
            required: false,
            default: 'Cancel',
        },
        cancelAction: {
            type: Function,
            required: false,
        },
    },

    setup(props, ctx) {
        const overLayOptions = {style: modalOverlayCSS};
        if (props.id) overLayOptions.id = props.id;

        const contentChildren = [];

        if (props.title) {
            const titleOptions = {};
            if (props.titleClass) titleOptions.class = props.titleClass;
            contentChildren.push(h(props.titleTag, titleOptions, [props.title]));
        }

        if (props.message) {
            const bodyOptions = {};
            contentChildren.push(h('p', bodyOptions, [props.message]));
        }

        if (props.cancelAction) {
            contentChildren.push(
                h(
                    'button',
                    {
                        onclick: () => {
                            props.cancelAction();
                            ctx.emit('close');
                        },
                    },
                    [props.cancelTitle]
                )
            );
        }

        contentChildren.push(
            h(
                'button',
                {
                    onclick: () => {
                        props.okAction();
                        ctx.emit('close');
                    },
                },
                [props.okTitle]
            )
        );

        return () => h('div', overLayOptions, [h('div', {style: modalContentCSS}, contentChildren)]);
    },
});

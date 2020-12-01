import {defineComponent, h} from 'vue';

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
            type: String,
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
        const closeModal = () => {
            if (props.cancelAction) props.cancelAction();
            ctx.emit('close');
        };

        const contentChildren = [];

        const headerChildren = [];
        if (props.title) {
            const titleOptions = {class: 'modal-title '};
            if (props.titleClass) titleOptions.class += props.titleClass;
            headerChildren.push(h(props.titleTag, titleOptions, [props.title]));
        }

        headerChildren.push(h('button', {class: 'btn-close', onclick: closeModal}));

        contentChildren.push(h('div', {class: 'modal-header'}, [headerChildren]));

        const bodyChildren = [];
        if (props.message) {
            bodyChildren.push(h('p', [props.message]));
        }
        contentChildren.push(h('div', {class: 'modal-body'}, [bodyChildren]));

        const footerChildren = [];
        if (props.cancelAction) {
            footerChildren.push(h('button', {class: 'btn btn-secondary', onclick: closeModal}, [props.cancelTitle]));
        }

        footerChildren.push(
            h(
                'button',
                {
                    class: 'btn btn-primary',
                    onclick: () => {
                        // TODO :: could probably use then / promises to only close when done with the action
                        props.okAction();
                        ctx.emit('close');
                    },
                },
                [props.okTitle]
            )
        );
        contentChildren.push(h('div', {class: 'modal-footer'}, [footerChildren]));

        const overLayOptions = {
            class: 'modal fade show',
            style: {display: 'block', 'background-color': 'rgba(0,0,0,0.4)'},
        };
        if (props.id) overLayOptions.id = props.id;

        return () =>
            h('div', overLayOptions, [
                h('div', {class: 'modal-dialog'}, [h('div', {class: 'modal-content'}, contentChildren)]),
            ]);
    },
});

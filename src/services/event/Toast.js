import {defineComponent, h, ref} from 'vue';

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

export const ToastComponent = defineComponent({
    props: {message: {type: String, required: true}, show: {type: Boolean, required: true}},
    setup(props, ctx) {
        console.log('setting up toast', props.message);
        return () => {
            console.log('rendering toast', props.message);
            return h('div', {style: toastCss.value, class: props.show ? 'show-toast' : 'hide-toast'}, [
                h('span', [props.message]),
                h(
                    'button',
                    {
                        onclick: () => {
                            if (!props.show) return;
                            ctx.emit('hide');
                        },
                    },
                    ['X']
                ),
            ]);
        };
    },
});

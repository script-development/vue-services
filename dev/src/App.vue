<template>
    <the-nav-bar />
    <img alt="Vue logo" src="./assets/logo.png" />
    <button @click="toast">Toasty!</button>
    <button @click="modal">Modal!</button>
    <router-view />
</template>

<script>
import {ref} from 'vue';
import {createToastMessage, createModal} from '../serv-vue';
import TheNavBar from './components/TheNavBar.vue';

export default {
    name: 'App',
    components: {
        TheNavBar,
    },
    setup() {
        const message = ref('hello');
        return {
            toast: () => {
                message.value += '1';
                createToastMessage(message.value, 'success');
            },
            modal: () => {
                message.value += '1';
                const modal = {message: message.value, okAction: () => console.log('OK!')};
                createModal(modal);
            },
        };
    },
};
</script>

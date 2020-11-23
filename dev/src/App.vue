<template>
    <the-nav-bar />
    <img alt="Vue logo" src="./assets/logo.png" />
    <button @click="toast">Toasty!</button>
    <router-view />
</template>

<script>
import {ref} from 'vue';
import {createToastMessage} from '../serv-vue';
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
        };
    },
};
</script>

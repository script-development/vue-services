<template>
    <the-nav-bar />
    <img alt="Vue logo" src="./assets/logo.png" />
    <button @click="toast">Toasty!</button>
    <router-view />
</template>

<script>
import {createToastMessage} from '../serv-vue';
import TheNavBar from './components/TheNavBar.vue';

export default {
    name: 'App',
    components: {
        TheNavBar,
    },
    setup() {
        return {toast: () => createToastMessage('hello', 'success')};
    },
};
</script>

<template>
    <the-nav-bar />
    <img alt="Vue logo" src="./assets/logo.png" />
    <router-view />
</template>

<script>
import TheNavBar from './components/TheNavBar.vue';

export default {
    name: 'App',
    components: {
        TheNavBar,
    },
};
</script>

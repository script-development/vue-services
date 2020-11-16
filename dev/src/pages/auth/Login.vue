<template>
    <form @submit.prevent="login">
        <input autocomplete="username" type="email" v-model="credentials.email" />
        <input autocomplete="current-password" type="password" v-model="credentials.password" />
        <button type="submit">Login!</button>
    </form>
</template>

<script>
import {ref} from 'vue';
import {login} from '../../../serv-vue';

export default {
    setup() {
        const credentials = ref({email: 'test@test.com', password: 'hahahaha', rememberMe: true});
        return {credentials, login: () => login(credentials.value)};
    },
};
</script>

<template>
    <b-container fluid class="login-container">
        <b-card no-body class="mx-auto">
            <div class="login-form">
                <h1>First2Find</h1>
                <form-login v-model="credentials" @submit="login" />
                <!-- <b-link class="d-block text-center" :to="{name: 'ForgotPassword'}">
                                    Wachtwoord vergeten
                                </b-link> -->
            </div>
        </b-card>
    </b-container>
</template>

<script>
import FormLogin from '../../components/forms/Login';
import {authService} from '@script-development/vue-services';
import {staticDataService} from '@script-development/vue-services/dist/index.esm';
import {STATIC_DATA} from '../../constants/staticdata';

export default {
    components: {FormLogin},
    data() {
        return {
            credentials: {
                email: '',
                password: '',
                rememberMe: true,
            },
        };
    },
    methods: {
        login() {
            authService.login(this.credentials).then(response => {
                staticDataService.getStaticData(STATIC_DATA);
            });
        },
    },
};
</script>

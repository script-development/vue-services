<template>
    <b-container fluid class="login-container">
        <b-row>
            <b-card no-body class="col-12 col-sm-10 col-md-9 col-lg-8 col-xl-6 mx-auto p-0">
                <b-row no-gutters>
                    <b-col sm="6" class="login-img"></b-col>
                    <b-col md="6">
                        <b-card-body>
                            <b-card-text class="login-form py-5">
                                <h1 class="w-200 h-75 mb-5">Logo First2Find</h1>
                                <p>
                                    Voer een nieuw wachtwoord in.
                                </p>
                                <form-reset-password v-model="data" />
                                <b-button block variant="primary" @click="sendEmailResetPassword">
                                    Verzenden
                                </b-button>
                            </b-card-text>
                        </b-card-body>
                    </b-col>
                </b-row>
            </b-card>
        </b-row>
    </b-container>
</template>

<script>
import FormResetPassword from '../../components/forms/ResetPassword';
import {authService} from '@script-development/vue-services';

export default {
    components: {FormResetPassword},
    data() {
        return {
            data: {
                token: this.$route.query.token,
                password: '',
                password2: '', // passwordConfirmation is een iets duidelijkere naam dan password2
            },
        };
    },
    methods: {
        sendEmailResetPassword() {
            authService.resetPassword(this.data);
        },
    },
};
</script>

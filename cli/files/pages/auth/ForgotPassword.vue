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
                                    Vul je email-adres in, je krijgt een link toegestuurd waarmee je jouw wachtwoord
                                    kunt resetten.
                                </p>
                                <form-forgot-password v-model="data" />
                                <b-button block variant="primary" type="submit" @click="sendEmailResetPassword">
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
import FormForgotPassword from '../../components/forms/ForgotPassword';
import {authService} from '@script-development/vue-services';

export default {
    components: {FormForgotPassword},
    data() {
        return {
            data: {
                email: '',
            },
        };
    },
    methods: {
        sendEmailResetPassword() {
            authService.sendEmailResetPassword(this.data);
        },
    },
};
</script>

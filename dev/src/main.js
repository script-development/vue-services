import '../server/index.js';

// import {createApp} from 'vue';
import App from './App.vue';
import LoginPage from './pages/auth/Login.vue';
import ResetPasswordPage from './pages/auth/ResetPassword.vue';
import './index.css';

import {userModule} from './modules/user';
import {companyModule} from './modules/company';
import {dashboardModule} from './modules/dashboard.js';

import {startApp} from '../serv-vue/index.js';

startApp(App, {userModule, dashboardModule, companyModule}, 'dashboard.overview', {
    login: LoginPage,
    resetPassword: ResetPasswordPage,
});

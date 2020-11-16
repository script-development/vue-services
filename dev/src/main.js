import '../server/index.js';

// import {createApp} from 'vue';
import App from './App.vue';
import './index.css';

import {usersModule} from './modules/users';
import {dashboardModule} from './modules/dashboard.js';

import {startApp} from '../serv-vue/index.js';

startApp(App, {usersModule, dashboardModule});

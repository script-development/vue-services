import '../server/index.js';

// import {createApp} from 'vue';
import App from './App.vue';
import './index.css';

import {usersModule} from './controllers/users';
import {dashboardModule} from './controllers/dashboard.js';

import {startApp} from '../serv-vue/index.js';

startApp(App, {usersModule, dashboardModule});

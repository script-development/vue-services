// import {createApp} from 'vue';
import App from './App.vue';
import './index.css';

import UsersModule from './controllers/users';

import {startApp} from '../serv-vue/index.js';

startApp(App, {UsersModule});

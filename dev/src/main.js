import '../server/index.js';

// import {createApp} from 'vue';
import App from './App.vue';
import './index.css';

import {usersModule} from './controllers/users';

import {startApp} from '../serv-vue/index.js';

startApp(App, {usersModule});

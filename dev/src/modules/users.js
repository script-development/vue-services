import {moduleFactory} from '../../serv-vue';
import OverviewPage from '../pages/users/Overview.vue';

export const usersModule = moduleFactory('users', {overview: OverviewPage}, {singular: 'user', plural: 'users'});

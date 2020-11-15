import {moduleFactory} from '../../serv-vue';
import OverviewPage from '../pages/users/Overview.vue';

export default moduleFactory('users', {overview: OverviewPage}, {singular: 'user', plural: 'users'});

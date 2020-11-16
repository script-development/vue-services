import {moduleFactory} from '../../serv-vue';
import Dashboard from '../pages/Dashboard.vue';

const dashboardModule = moduleFactory('dashboard', {overview: Dashboard}, {singular: 'dashboard', plural: 'dashboard'});

dashboardModule.routeSettings.base.path = '';

export {dashboardModule};

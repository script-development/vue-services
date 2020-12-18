import {moduleFactory} from '../../serv-vue';
import OverviewPage from '../pages/default/Overview.vue';

export const companyModule = moduleFactory(
    'companies',
    {overview: OverviewPage},
    {singular: 'company', plural: 'companies'}
);

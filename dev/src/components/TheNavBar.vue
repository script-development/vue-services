<template>
    <div>
        <a @click="goToDashboard">Home</a>
        |
        <a @click="goToUsersOverview">Users</a>
        |
        <a @click="goToCompanyOverview">Companies</a>
        |
        <a v-if="isLoggedIn" @click="logout">Logout</a>
    </div>
</template>
<script>
import {userModule} from '../modules/user';
import {companyModule} from '../modules/company';
import {dashboardModule} from '../modules/dashboard';
import {isLoggedIn, logout} from '../../serv-vue';

export default {
    setup() {
        return {
            goToUsersOverview: userModule.goToOverviewPage,
            goToDashboard: dashboardModule.goToOverviewPage,
            goToCompanyOverview: companyModule.goToOverviewPage,
            isLoggedIn: isLoggedIn,
            logout,
        };
    },
};
</script>

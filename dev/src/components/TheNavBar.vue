<template>
    <div>
        <a @click="goToDashboard">Home</a>
        |
        <a @click="goToUsersOverview">Users</a>
        |
        <a v-if="isLoggedIn" @click="logout">Logout</a>
    </div>
</template>
<script>
import {usersModule} from '../modules/users';
import {dashboardModule} from '../modules/dashboard';
import {isLoggedIn, logout} from '../../serv-vue';

export default {
    setup() {
        return {
            goToUsersOverview: usersModule.goToOverviewPage,
            goToDashboard: dashboardModule.goToOverviewPage,
            isLoggedIn: isLoggedIn,
            logout,
        };
    },
};
</script>

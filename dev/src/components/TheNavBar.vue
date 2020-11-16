<template>
    <div>
        <a @click="goToDashboard">Home</a>
        |
        <a @click="goToUsersOverview">Users</a>
    </div>
</template>
<script>
import {usersModule} from '../modules/users';
import {dashboardModule} from '../modules/dashboard';

export default {
    setup() {
        return {
            goToUsersOverview: usersModule.goToOverviewPage,
            goToDashboard: dashboardModule.goToOverviewPage,
        };
    },
};
</script>

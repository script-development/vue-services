<template>
    <div>{{ user }}</div>
</template>

<script>
import {onMounted} from 'vue';
import {userModule} from '../../modules/user';
export default {
    setup() {
        onMounted(() => userModule.showStoreActionByCurrentRouteId());
        return {user: userModule.getByCurrentRouteId};
    },
};
</script>

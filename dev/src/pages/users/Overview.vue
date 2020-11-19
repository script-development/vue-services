<template>
    <table>
        <thead>
            <tr>
                <th>Name</th>
            </tr>
        </thead>
        <tbody>
            <tr @click="goToShow(user.id)" v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import {computed} from 'vue';
import {userModule} from '../../modules/user';

export default {
    setup() {
        return {
            users: userModule.getAll,
            goToShow: id => userModule.goToShowPage(id),
        };
    },
};
</script>

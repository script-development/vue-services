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
import {usersModule} from '../../modules/users';

export default {
    setup() {
        return {
            users: usersModule.getAll,
            goToShow: id => usersModule.goToShowPage(id),
        };
    },
};
</script>

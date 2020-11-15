<template>
    <div>OVERVIEW</div>
    <table>
        <thead>
            <tr>
                <th>Name</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ users }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import {computed} from 'vue';
import {usersModule} from '../../controllers/users';
export default {
    setup() {
        const users = usersModule.getAll;
        return {users};
    },
};
</script>

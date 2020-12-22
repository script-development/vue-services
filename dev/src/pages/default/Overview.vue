<template>
    <table>
        <thead>
            <tr>
                <th v-for="header in headers" :key="header">{{ header }}</th>
            </tr>
        </thead>
        <tbody>
            <tr @click="goToShow(item.id)" v-for="item in items" :key="item.id">
                <td>{{ item.id }}</td>
                <td v-for="header in headers" :key="header">{{ item[header] }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import {computed} from 'vue';
import {getCurrentRouteModuleName} from '../../../serv-vue';

export default {
    setup() {
        const activeModule = getCurrentRouteModuleName();
        const items = activeModule.getAll;
        return {
            headers: computed(() => (items.value.length ? Object.keys(items.value[0]) : [])),
            items,
            goToShow: id => activeModule.goToShowPage(id),
        };
    },
};
</script>

<template>
    <div id="wrapper" :class="bodyClass">
        <div id="content-wrapper">
            <div id="content">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        bodyClass() {
            const routeName = this.$route.name || '';
            const bodyClass = routeName.replace(/\./g, '-').toLowerCase();
            return bodyClass;
        },
    },
};
</script>

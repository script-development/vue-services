export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/index.cjs.js',
            format: 'cjs',
            exports: 'named',
        },
        {
            file: 'dist/index.es.js',
            format: 'es',
        },
    ],
    external: ['vue', 'vuex', 'vue-router', 'axios', '@msgpack/msgpack', 'bootstrap-vue'],
    treeshake: {
        moduleSideEffects: false,
    }
};

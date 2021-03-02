import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    // server: {
    //     // cors: true,
    //     proxy: {
    //         '^/api/.*': {
    //             target: 'http://localhost:8000',
    //             changeOrigin: true,
    //             secure: false,
    //         },
    //     },
    // },
    optimizeDeps: {
        include: [
            'lodash.get',
            'lodash.has',
            'lodash.assign',
            'lodash.camelcase',
            'lodash.clonedeep',
            'lodash.compact',
            'lodash.find',
            'lodash.flatten',
            'lodash.forin',
            'lodash.get',
            'lodash.has',
            'lodash.invokemap',
            'lodash.isempty',
            'lodash.isequal',
            'lodash.isfunction',
            'lodash.isinteger',
            'lodash.isplainobject',
            'lodash.lowerfirst',
            'lodash.map',
            'lodash.mapvalues',
            'lodash.pick',
            'lodash.snakecase',
            'lodash.uniq',
            'lodash.uniqby',
            'lodash.values',
            'faker',
        ],
    },
});

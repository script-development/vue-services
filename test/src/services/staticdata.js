import assert from 'assert';

const {deepStrictEqual} = assert;

import {deleteServiceFromCache, newService} from '../../helpers';

describe('StaticData Service', () => {
    after(() => deleteServiceFromCache('staticdata'));

    describe('Normal Store module factory', () => {
        it('should return store module', () => {
            const {createStoreModules, store} = newService('staticdata');
            createStoreModules(['profiles']);
            assert(store.profiles);
        });

        it('should be added to the normal DATA prop', () => {
            const {createStoreModules, DATA} = newService('staticdata');
            createStoreModules(['profiles']);
            deepStrictEqual(DATA.normal, ['profiles']);
        });
    });
});

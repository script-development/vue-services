/**
 * @typedef {import('axios-mock-adapter').default} AxiosMock
 */
import assert from 'assert';
import {getAllFromStore, registerStoreModule} from '../../../src/services/store';
import storeModuleFactory from '../../../src/services/store/factory';

const {deepStrictEqual, strictEqual} = assert;

describe('Store Service', () => {
    describe('Store module factory', () => {
        it('should return store module with the all property', () => {
            const storeModule = storeModuleFactory('users');
            assert('all' in storeModule);
        });

        it('should return store module with the byId property', () => {
            const storeModule = storeModuleFactory('posts');
            assert('byId' in storeModule);
        });

        it('should return store module with the setAll property', () => {
            const storeModule = storeModuleFactory('comments');
            assert('setAll' in storeModule);
        });
    });

    describe('Store Module', () => {
        const storeModule = storeModuleFactory('mentors');
        it('should contain an empty array for the all property', () => {
            deepStrictEqual(storeModule.all.value, []);
        });

        it('should set all given data in the store', () => {
            storeModule.setAll([
                {id: 1, name: 'Harry'},
                {id: 2, name: 'Sjaak'},
            ]);

            deepStrictEqual(storeModule.all.value, [
                {id: 1, name: 'Harry'},
                {id: 2, name: 'Sjaak'},
            ]);
        });

        it('should add an item to data when data is not an array, but an item with an id', () => {
            storeModule.setAll({id: 4, name: 'Klaas'});

            deepStrictEqual(storeModule.all.value, [
                {id: 1, name: 'Harry'},
                {id: 2, name: 'Sjaak'},
                {id: 4, name: 'Klaas'},
            ]);
        });

        it('should not add an item to data when data is not an array, but an item without an id', () => {
            storeModule.setAll({name: 'John'});

            deepStrictEqual(storeModule.all.value, [
                {id: 1, name: 'Harry'},
                {id: 2, name: 'Sjaak'},
                {id: 4, name: 'Klaas'},
            ]);
        });

        it('should add an item to data when data is an array with one single item', () => {
            storeModule.setAll({id: 5, name: 'Griet'});

            deepStrictEqual(storeModule.all.value, [
                {id: 1, name: 'Harry'},
                {id: 2, name: 'Sjaak'},
                {id: 4, name: 'Klaas'},
                {id: 5, name: 'Griet'},
            ]);
        });

        it('should replace an item from data when data is an array with one single item, with an already existing id', () => {
            storeModule.setAll({id: 2, name: 'Marie'});

            deepStrictEqual(storeModule.all.value, [
                {id: 1, name: 'Harry'},
                {id: 2, name: 'Marie'},
                {id: 4, name: 'Klaas'},
                {id: 5, name: 'Griet'},
            ]);
        });

        it('should replace an item from data when data is not an array, but an item with an already existing id', () => {
            storeModule.setAll({id: 4, name: 'Klaske'});

            deepStrictEqual(storeModule.all.value, [
                {id: 1, name: 'Harry'},
                {id: 2, name: 'Marie'},
                {id: 4, name: 'Klaske'},
                {id: 5, name: 'Griet'},
            ]);
        });

        it('should get an item by id when byId is called', () => {
            deepStrictEqual(storeModule.byId(4), {id: 4, name: 'Klaske'});
        });

        it('should get undefined when byId is called on a non existing id', () => {
            strictEqual(storeModule.byId(14), undefined);
        });

        it('should replace all items from data when data is an array with multiple items', () => {
            storeModule.setAll([
                {id: 1, type: 'bow', arrows: 4, missed: 1},
                {id: 2, type: 'axe'},
                {id: 4, type: 'sword'},
            ]);

            deepStrictEqual(storeModule.all.value, [
                {id: 1, type: 'bow', arrows: 4, missed: 1},
                {id: 2, type: 'axe'},
                {id: 4, type: 'sword'},
            ]);
        });

        it('should not replace the items from data when the item has more values', () => {
            storeModule.setAll([
                {id: 1, type: 'bow', arrows: 4},
                {id: 2, type: 'axe'},
                {id: 4, type: 'sword'},
            ]);

            deepStrictEqual(storeModule.all.value, [
                {id: 1, type: 'bow', arrows: 4, missed: 1},
                {id: 2, type: 'axe'},
                {id: 4, type: 'sword'},
            ]);
        });
    });

    describe('registering store modules', () => {
        it('should add the module to the store', () => {
            registerStoreModule('clients', storeModuleFactory('clients'));
            strictEqual(getAllFromStore('clients').value.length, 0);
        });
    });
});

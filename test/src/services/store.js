/**
 * @typedef {import('axios-mock-adapter').default} AxiosMock
 */
import assert from 'assert';
import {StoreModuleNotFoundError} from '../../../src/errors/StoreModuleNotFoundError';
import storeModuleFactory from '../../../src/services/store/factory';
import {
    getAllFromStore,
    registerStoreModule,
    generateAndRegisterDefaultStoreModule,
    getByIdFromStore,
    responseMiddleware,
} from '../../../src/services/store';

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
            deepStrictEqual(storeModule.byId(4).value, {id: 4, name: 'Klaske'});
        });

        it('should get undefined when byId is called on a non existing id', () => {
            strictEqual(storeModule.byId(14).value, undefined);
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

    describe('generating and registering store modules', () => {
        it('should add the generated module to the store', () => {
            generateAndRegisterDefaultStoreModule('fields');
            strictEqual(getAllFromStore('fields').value.length, 0);
        });
    });

    describe('getting items from store', () => {
        it('should throw an error when trying to get all from an unknown module', () => {
            assert.throws(
                () => deepStrictEqual(getAllFromStore('does-not-exist')),
                error => {
                    assert(error instanceof StoreModuleNotFoundError);
                    strictEqual(error.name, 'StoreModuleNotFoundError');
                    // TODO :: make this one work
                    // strictEqual(error.message, `Could not find does-not-exist, only these modules exists at the moment: ${moduleNames.toString()}`)
                    return true;
                }
            );
        });

        it('should get all items from store when calling getAllFromStore', () => {
            const namesModule = storeModuleFactory('names');
            registerStoreModule('names', namesModule);
            namesModule.setAll([
                {id: 1, description: 'this is a test'},
                {id: 2, description: 'this is another test'},
                {id: 3, description: 'this is the ultimate test'},
            ]);

            deepStrictEqual(getAllFromStore('names').value, [
                {id: 1, description: 'this is a test'},
                {id: 2, description: 'this is another test'},
                {id: 3, description: 'this is the ultimate test'},
            ]);
        });

        it('should get one item from store when calling getByIdFromStore', () => {
            deepStrictEqual(getByIdFromStore('names', 1).value, {id: 1, description: 'this is a test'});
        });

        it('should throw an error when trying to get by id from an unknown module', () => {
            assert.throws(
                () => deepStrictEqual(getByIdFromStore('does-not-exist', 12)),
                error => {
                    assert(error instanceof StoreModuleNotFoundError);
                    strictEqual(error.name, 'StoreModuleNotFoundError');
                    // TODO :: make this one work
                    // strictEqual(error.message, `Could not find does-not-exist, only these modules exists at the moment: ${moduleNames.toString()}`)
                    return true;
                }
            );
        });

        // TODO :: is this desired behaviour?
        it('should return undefined from store when calling getByIdFromStore with an unkown id', () => {
            deepStrictEqual(getByIdFromStore('names', 12).value, undefined);
        });
    });

    describe('store module response middleware', () => {
        it('should do nothing when there is no data', () => {
            strictEqual(responseMiddleware({}), undefined);
        });

        it('should add data to the store when data is known in the store modules', () => {
            responseMiddleware({data: {names: [{id: 4, description: 'added test data'}]}});
            deepStrictEqual(getByIdFromStore('names', 4).value, {id: 4, description: 'added test data'});
        });
    });
});

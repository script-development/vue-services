import assert from 'assert';

// since the test is running in node, localStorage is not defined, so we mock it
const localStorageMock = {
    data: {},

    getItem(key) {
        if (key in this.data) return this.data[key];
        return null;
    },

    setItem(key, value) {
        this.data[key] = value;
    },

    clear() {
        this.data = {};
    },
};

global.localStorage = localStorageMock;

const newStorageService = () => {
    // deleting the storage service from cache, so it can load again in another test, with a base new localStorageMock
    delete require.cache[require.resolve('../../../src/services/storage')];
    const {StorageService} = require('../../../src/services/storage');
    return new StorageService();
};

describe('Storage Service', () => {
    describe('test stored keepALive values', () => {
        it('value of keepALive should be false', () => {
            const storageService = newStorageService();
            assert.strictEqual(storageService.keepALive, false);
            // deleting the storage service from cache, so it can load again in another test
        });

        it('value of keepALive should be true', () => {
            localStorageMock.data.keepALive = 'true';
            const storageService = newStorageService();
            assert.strictEqual(storageService.keepALive, true);
        });
    });

    describe('setting and getting items with keepALive as false', () => {
        it('getting a set item should return null', () => {
            const storageService = newStorageService();
            storageService.keepALive = false;

            storageService.setItem('customers', [{name: 'Macro'}]);
            assert.strictEqual(storageService.getItem('customers'), null);
        });

        it('clearing the storage, items should still be returned as null', () => {
            const storageService = newStorageService();
            storageService.keepALive = false;

            storageService.setItem('invoices', [{id: 5}]);
            assert.strictEqual(storageService.getItem('invoices'), null);

            storageService.clear();

            assert.strictEqual(storageService.getItem('invoices'), null);
        });
    });

    describe('setting and getting items with keepALive as true', () => {
        const storageService = newStorageService();

        it('setting a string item should return the item as a string with getItem and without parse', () => {
            // TODO :: setting keepALive here as true, so it won't effect other tests
            // find out a better way to set these tests
            storageService.keepALive = true;
            storageService.setItem('username', 'Harry');
            assert.strictEqual(storageService.getItem('username'), 'Harry');
        });

        it('setting a string item should return the item as a string with getItem and with parse set to true', () => {
            storageService.setItem('username', 'Harry');
            assert.strictEqual(storageService.getItem('username', true), 'Harry');
        });

        it('setting a string item should return the item as a string with getItem and with parse set to false', () => {
            storageService.setItem('username', 'Harry');
            assert.strictEqual(storageService.getItem('username', false), 'Harry');
        });

        it("getting an item that's not stored should return null", () => {
            assert.strictEqual(storageService.getItem('roles'), null);
        });

        it('setting an Object should be returned as a string with getItem and with parse set to false', () => {
            storageService.setItem('customers', [{name: 'Macro'}]);
            assert.strictEqual(storageService.getItem('customers', false), '[{"name":"Macro"}]');
        });

        it('setting an Object should be returned as an Object with getItem and with parse set to true', () => {
            storageService.setItem('customers', [{name: 'Macro'}]);
            // using not strict equal here, cause it returns it in a different format
            assert.notStrictEqual(storageService.getItem('customers', true), [{name: 'Macro'}]);
        });

        it('clear should cleanout the storage', () => {
            storageService.setItem('isAdmin', true);
            assert.strictEqual(storageService.getItem('isAdmin', true), true);
            storageService.clear();
            assert.strictEqual(storageService.getItem('isAdmin', true), null);
        });
    });
});

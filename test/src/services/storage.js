import assert from 'assert';
import {deleteServiceFromCache, newService} from '../../helpers';

describe('Storage Service', () => {
    after(() => deleteServiceFromCache('storage'));

    describe('test stored keepALive values', () => {
        it('value of keepALive should be false', () => {
            const {getKeepALive} = newService('storage');
            assert.strictEqual(getKeepALive(), false);
            // deleting the storage service from cache, so it can load again in another test
        });

        it('value of keepALive should be true when stored value is true', () => {
            global.localStorage.data.keepALive = 'true';
            const {getKeepALive} = newService('storage');
            assert.strictEqual(getKeepALive(), true);
        });
    });

    describe('setting and getting items with keepALive as false', () => {
        it('getting a set item should return null', () => {
            const {setKeepALive, setItemInStorage, getItemFromStorage} = newService('storage');
            setKeepALive(false);

            setItemInStorage('customers', [{name: 'Macro'}]);
            assert.strictEqual(getItemFromStorage('customers'), null);
        });

        it('clearing the storage, items should still be returned as null', () => {
            const {setKeepALive, setItemInStorage, getItemFromStorage, clearStorage} = newService('storage');
            setKeepALive(false);

            setItemInStorage('invoices', [{id: 5}]);
            assert.strictEqual(getItemFromStorage('invoices'), null);

            clearStorage();

            assert.strictEqual(getItemFromStorage('invoices'), null);
        });
    });

    describe('setting and getting items with keepALive as true', () => {
        const {setKeepALive, setItemInStorage, getItemFromStorage, clearStorage} = newService('storage');

        it('setting a string item should return the item as a string with getItem and without parse', () => {
            // TODO :: setting keepALive here as true, so it won't effect other tests
            // find out a better way to set these tests
            setKeepALive(true);
            setItemInStorage('username', 'Harry');
            assert.strictEqual(getItemFromStorage('username'), 'Harry');
        });

        it('setting a string item should return the item as a string with getItem and with parse set to true', () => {
            setItemInStorage('username', 'Harry');
            assert.strictEqual(getItemFromStorage('username', true), 'Harry');
        });

        it('setting a string item should return the item as a string with getItem and with parse set to false', () => {
            setItemInStorage('username', 'Harry');
            assert.strictEqual(getItemFromStorage('username', false), 'Harry');
        });

        it("getting an item that's not stored should return null", () => {
            assert.strictEqual(getItemFromStorage('roles'), null);
        });

        it('setting an Object should be returned as a string with getItem and with parse set to false', () => {
            setItemInStorage('customers', [{name: 'Macro'}]);
            assert.strictEqual(getItemFromStorage('customers', false), '[{"name":"Macro"}]');
        });

        it('setting an Object should be returned as an Object with getItem and with parse set to true', () => {
            setItemInStorage('customers', [{name: 'Macro'}]);
            // using not strict equal here, cause it returns it in a different format
            assert.notStrictEqual(getItemFromStorage('customers', true), [{name: 'Macro'}]);
        });

        it('clear should cleanout the storage', () => {
            setItemInStorage('isAdmin', true);
            assert.strictEqual(getItemFromStorage('isAdmin', true), true);
            clearStorage();
            assert.strictEqual(getItemFromStorage('isAdmin', true), null);
        });
    });
});

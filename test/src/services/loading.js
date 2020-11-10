import assert from 'assert';

const {strictEqual} = assert;

import {loading, setLoading} from '../../../src/services/loading';

const sleep = time => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

describe('Loading Service', () => {
    describe('test stored loading value', () => {
        it('initial value of loading should be false', () => {
            strictEqual(loading.value, false);
        });
    });
    describe('test setting new loading value', () => {
        it('should be false when loading is already false', async () => {
            setLoading(false);
            strictEqual(loading.value, false);
        });
        it('should be false immediatly after calling the function', () => {
            setLoading(true);
            strictEqual(loading.value, false);
        });
        it('should be true after 500ms', async () => {
            setLoading(true);
            await sleep(500);
            strictEqual(loading.value, true);
        });
        it('should be true after 1000ms', async () => {
            setLoading(true);
            await sleep(500);
            setLoading(false);
            await sleep(500);
            strictEqual(loading.value, true);
        });
        it('should be false after 1500ms', async () => {
            setLoading(true);
            await sleep(500);
            setLoading(false);
            await sleep(1000);
            strictEqual(loading.value, false);
        });
        it('should be false after 1000ms', async () => {
            setLoading(true);
            await sleep(1900);
            setLoading(false);
            strictEqual(loading.value, true);
        });
    });
});

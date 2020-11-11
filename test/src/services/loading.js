import assert from 'assert';

const {strictEqual} = assert;

import {loading, setLoading, setMinTimeSpinner, setSpinnerTimeout} from '../../../src/services/loading';

const sleep = time => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

describe('Loading Service', () => {
    describe('initial value', () => {
        it('should be false', () => {
            strictEqual(loading.value, false);
        });
    });

    describe('setLoading function', () => {
        // TODO :: maybe use sinon.useFakeTimers? check https://sinonjs.org/releases/v1.17.6/fake-timers/
        // setting spinner timeout and mintime spinner to lower value, so the tests speed up
        setSpinnerTimeout(20);
        setMinTimeSpinner(20);

        it('should not change loading when loading is already false', async () => {
            setLoading(false);
            strictEqual(loading.value, false);
        });

        it('should not immediatly set loading to true after calling the function with loading = true', () => {
            setLoading(true);
            strictEqual(loading.value, false);
        });

        it('should set loading to true after spinnerTimeout time', async () => {
            setLoading(true);
            await sleep(20);
            strictEqual(loading.value, true);
        });

        it('should not set loading to false after calling setloading with false when calling the function when the mintimespinner is active', async () => {
            setLoading(true);
            await sleep(25);
            setLoading(false);
            await sleep(10);
            strictEqual(loading.value, true);
        });

        it('should set loading to false after the mintimespinner time has been done', async () => {
            setLoading(true);
            await sleep(25);
            setLoading(false);
            await sleep(25);
            strictEqual(loading.value, false);
        });

        it('should set loading to false after calling the function with false after the mintimespinner time has elapsed', async () => {
            setLoading(true);
            await sleep(50);
            setLoading(false);
            strictEqual(loading.value, true);
        });
    });
});

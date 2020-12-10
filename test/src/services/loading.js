import assert from 'assert';
import Sinon from 'sinon';

const {strictEqual} = assert;

import {deleteServiceFromCache, newService} from '../../helpers';

describe('Loading Service', () => {
    after(() => deleteServiceFromCache('loading'));

    describe('initial value', () => {
        it('should be false', () => {
            const {loading} = newService('loading');
            strictEqual(loading.value, false);
        });
    });

    describe('setLoading function', () => {
        it('should not change loading when loading is already false', () => {
            const {loading, setLoading} = newService('loading');
            setLoading(false);
            strictEqual(loading.value, false);
        });

        it('should not immediatly set loading to true after calling the function with loading = true', () => {
            const {loading, setLoading} = newService('loading');
            setLoading(true);
            strictEqual(loading.value, false);
        });

        it('should set loading to true after spinnerTimeout time', () => {
            const {loading, setLoading} = newService('loading');

            const clock = Sinon.useFakeTimers();
            setLoading(true);
            clock.tick(500);
            strictEqual(loading.value, true);
            clock.runAll();
            clock.restore();
        });

        it('should not set loading to false after calling setloading with false when calling the function when the mintimespinner is active', () => {
            const {loading, setLoading} = newService('loading');
            const clock = Sinon.useFakeTimers();

            setLoading(true);
            clock.tick(1000);
            setLoading(false);
            clock.tick(200);
            strictEqual(loading.value, true);

            clock.runAll();
            clock.restore();
        });

        it('should set loading to false after the mintimespinner time has been done', () => {
            const {loading, setLoading} = newService('loading');
            const clock = Sinon.useFakeTimers();

            setLoading(true);
            clock.tick(1000);
            setLoading(false);
            clock.tick(1000);
            strictEqual(loading.value, false);

            clock.runAll();
            clock.restore();
        });

        it('should set loading to false after calling the function with false after the mintimespinner time has elapsed', () => {
            const {loading, setLoading} = newService('loading');
            const clock = Sinon.useFakeTimers();

            setLoading(true);
            clock.tick(2000);
            setLoading(false);
            strictEqual(loading.value, true);

            clock.runAll();
            clock.restore();
        });
    });
});

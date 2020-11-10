/**
 * @typedef {import('axios-mock-adapter').default} AxiosMock
 */

import assert from 'assert';
import {
    getCacheDuration,
    setCacheDuration,
    postRequest,
    deleteRequest,
    getRequest,
    // download,
    registerRequestMiddleware,
    registerResponseErrorMiddleware,
    registerResponseMiddleware,
} from '../../../src/services/http';

const {strictEqual} = assert;
/** @type {AxiosMock} */
const axiosMock = global.axiosMock;

describe('HTTP Service', () => {
    describe('cache duration setting', () => {
        it('should be 10 in the beginning', () => {
            strictEqual(getCacheDuration(), 10);
        });

        it('should be able to set to a different number', () => {
            setCacheDuration(20);
            strictEqual(getCacheDuration(), 20);
        });
    });

    describe('requests', () => {
        // TODO :: async functions gives `not covered every branch`, because it gets transpiled
        // check: https://github.com/istanbuljs/nyc/issues/265
        // and i think it has something todo with: "plugins": [["@babel/transform-runtime"]]
        // since that transpiles it to runtimeGenerator or something
        // and it should not be a problem to not use it, since Node V8
        it('postRequest should send a post request with data', async () => {
            // TODO :: Werkt niet - Gerard
            axiosMock.onPost('/users').replyOnce(config => {
                strictEqual(config.data, '{"name":"Harry"}');
                return [200];
            });

            await postRequest('/users', {name: 'Harry'})
                .then(response => strictEqual(response.status, 200))
                // it needs a catch
                .catch(() => assert(false));
        });

        it('deleteRequest should send a delete request', async () => {
            axiosMock.onDelete('/users/1').replyOnce(200);

            await deleteRequest('/users/1')
                .then(response => strictEqual(response.status, 200))
                // it needs a catch
                .catch(() => assert(false));
        });

        it('getRequest should send a get request', async () => {
            axiosMock.onGet('/users').replyOnce(200);

            await getRequest('/users')
                .then(response => strictEqual(response.status, 200))
                // it needs a catch
                .catch(() => assert(false));
        });

        it('getRequest within cache duration should not send a get request', async () => {
            const noResponse = await getRequest('/users');
            strictEqual(noResponse, undefined);
        });

        it('getRequest within cache duration should send a get request if options are give', async () => {
            axiosMock.onGet('/users').replyOnce(200);

            await getRequest('/users', {params: {status: 12}})
                .then(response => strictEqual(response.status, 200))
                // it needs a catch
                .catch(() => assert(false));
        });

        it('getRequest after cache duration should send a get request', async () => {
            setCacheDuration(0);
            axiosMock.onGet('/users').replyOnce(200);

            await getRequest('/users')
                .then(response => strictEqual(response.status, 200))
                // it needs a catch
                .catch(() => assert(false));
        });

        it('getRequest with data should send a get request with data as params', async () => {
            axiosMock.onGet('/reports').replyOnce(config => {
                strictEqual(config.params.name, 'Sjaak');
                return [200];
            });

            await getRequest('/reports', {params: {name: 'Sjaak'}})
                .then(response => strictEqual(response.status, 200))
                // it needs a catch
                .catch(() => assert(false));
        });

        it('download should do a lot of stuff, how to test?', async () => {
            // axiosMock.onGet('/do-little').replyOnce(200);
            // await download('/do-little', 'test.csv')
            //     .then(response => strictEqual(response.status, 200))
            //     // it needs a catch
            //     .catch(() => assert(false));
        });

        it('download should send a get request with responseType blob', async () => {
            // axiosMock.onGet('/get-this').replyOnce(config => {
            //     strictEqual(config.responseType, 'blob');
            //     return [200, {}, {'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}];
            // });
            // await download('/get-this', 'test.csv')
            //     .then(response => strictEqual(response.status, 200))
            //     // it needs a catch
            //     .catch(() => assert(false));
        });
    });

    describe('middleware-interceptors', () => {
        it('should not run registered response error middleware when there is no response in the error', async () => {
            // there is no response when it never reaches the server, but how to test?
        });

        it('should run registered response error middleware', async () => {
            let errorResponseCode;
            registerResponseErrorMiddleware(error => (errorResponseCode = error.response.status));
            axiosMock.onGet('/status').replyOnce(500);

            await getRequest('/status')
                .then()
                .catch(() => {});
            strictEqual(errorResponseCode, 500);
        });

        it('should run registered response middleware', async () => {
            let responseCode;
            registerResponseMiddleware(response => (responseCode = response.status));
            axiosMock.onGet('/status-correct').replyOnce(200);

            await getRequest('/status-correct')
                .then()
                .catch(() => {});
            strictEqual(responseCode, 200);
        });

        it('should run registered request middleware', async () => {
            let sendingParamDay;
            registerRequestMiddleware(request => (sendingParamDay = request.params.day));
            axiosMock.onGet('/status-correct').replyOnce(200);

            await getRequest('/status-correct', {params: {day: 12}})
                .then()
                .catch(() => {});
            strictEqual(sendingParamDay, 12);
        });
    });
});

/**
 * @typedef {import('axios-mock-adapter').default} AxiosMock
 */
import {deepStrictEqual, strictEqual} from 'assert';
import {
    getCacheDuration,
    setCacheDuration,
    postRequest,
    deleteRequest,
    getRequest,
    download,
    registerRequestMiddleware,
    registerResponseErrorMiddleware,
    registerResponseMiddleware,
} from '../../../src/services/http';

/** @type {AxiosMock} */
const axiosMock = global.axiosMock;

const xlsxContentType = {'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};

describe('HTTP Service', () => {
    before(() => {
        // Some global simple mockups
        global.Blob = () => {};
        global.document = {
            createElement: () => ({
                link: undefined,
                download: undefined,
                click: () => {},
            }),
        };
        global.window = {URL: {createObjectURL: () => {}}};
    });

    // jsdom();
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
            let responseData;
            axiosMock.onPost('/users').replyOnce(config => {
                responseData = config.data;
                return [200];
            });

            await postRequest('/users', {name: 'Harry'})
                .then(response => strictEqual(response.status, 200))
                // it needs a catch
                .catch(() => assert(false));

            strictEqual(responseData, '{"name":"Harry"}');
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
            let recievedParam;
            axiosMock.onGet('/reports').replyOnce(config => {
                recievedParam = config.params.name;
                return [200];
            });

            await getRequest('/reports', {params: {name: 'Sjaak'}})
                .then(response => strictEqual(response.status, 200))
                // it needs a catch
                .catch(() => assert(false));
            strictEqual(recievedParam, 'Sjaak');
        });

        it('download should send a request and get a 200 response', async () => {
            axiosMock.onGet('/do-little').replyOnce(config => {
                return [200, {}, xlsxContentType];
            });
            await download('/do-little', 'test.csv')
                .then(response => strictEqual(response.status, 200))
                // it needs a catch
                .catch(() => assert(false));
        });

        it('download should send a get request with responseType blob', async () => {
            let recievedResponseType;
            axiosMock.onGet('/get-this').replyOnce(config => {
                recievedResponseType = config.responseType;
                return [200, {}, xlsxContentType];
            });

            await download('/get-this', 'test.csv')
                .then(response => strictEqual(response.status, 200))
                // it needs a catch
                .catch(() => assert(false));

            strictEqual(recievedResponseType, 'blob');
        });

        it('download should use the type when given one', async () => {
            axiosMock.onGet('/get-html').replyOnce(config => {
                return [200, 'data'];
            });

            // kind of a hacky way to test this, TODO :: find a better way
            let passedOptions;
            global.Blob = (parts, options) => (passedOptions = options);

            await download('/get-html', 'test.csv', 'html')
                .then(response => strictEqual(response.status, 200))
                // it needs a catch
                .catch(() => assert(false));

            deepStrictEqual(passedOptions, {type: 'html'});
        });
    });

    describe('middleware-interceptors', () => {
        it('should not run registered response error middleware when there is no response in the error', async () => {
            // TODO :: there is no response when it never reaches the server, but how to test?
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
            registerRequestMiddleware(request => (sendingParamDay = request.params?.day));
            axiosMock.onGet('/status-correct').replyOnce(200);

            await getRequest('/status-correct', {params: {day: 12}})
                .then()
                .catch(() => {});
            strictEqual(sendingParamDay, 12);
        });
    });
});

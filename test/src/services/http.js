import assert from 'assert';
// import {HTTPService} from '../../../src/services/http';
import {getCacheDuration, setCacheDuration} from '../../../src/services/http';
import MockAdapter from 'axios-mock-adapter';

// const storageServiceMock = {
//     getItem() {
//         return {};
//     },
// };

describe('HTTP Service', () => {
    describe('cache duration', () => {
        it('should be 10 in the beginning', () => {
            assert.strictEqual(getCacheDuration(), 10);
        });

        it('should be able to set to a different number', () => {
            setCacheDuration(20);
            assert.strictEqual(getCacheDuration(), 20);
        });
    });
    // const httpService = new HTTPService(storageServiceMock);

    // const axiosMock = new MockAdapter(httpService._http);
    // beforeEach(() => axiosMock.resetHandlers());

    // it('post should send a post request with data', () => {
    //     axiosMock.onPost('/users').reply(200);

    //     httpService.post('/users', {name: 'Harry'}).then(response => {
    //         assert.strictEqual(response.status, 200);
    //     });
    // });

    // it('delete should send a delete request', () => {
    //     axiosMock.onDelete('/users/1').reply(200);

    //     httpService.delete('/users/1').then(response => {
    //         assert.strictEqual(response.status, 200);
    //     });
    // });
});

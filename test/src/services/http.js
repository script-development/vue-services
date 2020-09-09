import assert from 'assert';
import {HTTPService} from '../../../src/services/http';
import MockAdapter from 'axios-mock-adapter';

const storageServiceMock = {
    getItem() {
        return {};
    },
};

describe('HTTP Service', () => {
    const httpService = new HTTPService(storageServiceMock);

    const axiosMock = new MockAdapter(httpService._http);
    beforeEach(() => axiosMock.resetHandlers());

    it('post should send a post request with data', () => {
        axiosMock.onPost('/users').reply(200);

        httpService.post('/users', {name: 'Harry'}).then(response => {
            assert.strictEqual(response.status, 200);
        });
    });

    it('delete should send a delete request', () => {
        axiosMock.onDelete('/users/1').reply(200);

        httpService.delete('/users/1').then(response => {
            assert.strictEqual(response.status, 200);
        });
    });
});

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

// TODO :: should be a better option then this
// http service instantiates an axios instance and it's unaccessable from outside
// since the http service will be imported before the test itself, you can't mock it afterwards
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

global.axiosMock = new MockAdapter(axios);

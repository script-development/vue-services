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

const keepALiveKey = 'keepALive';
/** setting keepALive here so we don't have to Parse it each time we get it */
let keepALive = JSON.parse(localStorage.getItem(keepALiveKey));

export class StorageService {
    set keepALive(value) {
        localStorage.setItem(keepALiveKey, value);
        keepALive = value;
    }

    get keepALive() {
        return keepALive;
    }

    setItem(key, value, size) {
        if (!this.keepALive) return;
        localStorage.setItem(key, value);
    }

    getItem(key) {
        if (!this.keepALive) return null;
        return localStorage.getItem(key);
    }

    clear() {
        if (!this.keepALive) return;
        localStorage.clear();
    }
}

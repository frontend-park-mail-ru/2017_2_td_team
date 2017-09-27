export class Http {
    static get(address) {
        return fetch(address, {
            method: 'get',
            credentials: 'include',
            mode: 'cors',
        })
            .then(Http.checkStatus);
    }

    static post(address, body = {}) {
        return fetch(address, {
            method: 'post',
            credentials: 'include',
            mode: 'cors',
            headers: {'Content-Type': 'application/json; charset=utf8'},
            body: JSON.stringify(body)
        })
            .then(Http.checkStatus);
    }

    static checkStatus(res) {
        if (res.status < 400) {
            return Promise.resolve(res);
        } else {
            return Promise.reject(res);
        }
    }
}

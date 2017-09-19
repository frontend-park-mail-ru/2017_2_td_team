export class Http {
  static get(address) {
    return fetch(address, {
      method: 'get',
      credential: 'include'
    })
      .then(Http.checkStatus)
      .then(res => res.json());
  }

  static post(address, body) {
    return fetch(address, {
      method: 'post',
      credential: 'include',
      headers: {'Content-Type': 'application/json; charset=utf8'},
      body: JSON.stringify(body)
    })
      .then(Http.checkStatus)
      .then(res => res.json());
  }

  static checkStatus(res) {
    if (res.status >= 400)
      return Promise.resolve(res);
    else
      return Promise.reject(new Error(res.text()));
  }
}

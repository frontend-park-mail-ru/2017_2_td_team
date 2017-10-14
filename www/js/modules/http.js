/**
 * Модуль, предоставляющий api для выполнения http-запросов
 * @module Http
 */
export default class Http {
    /**
     * Совершает GET запрос по address, с передачей cookies, рассчитан на CORS
     *
     * @param {string} address - url по которому совершается запрос
     * @returns {Promise.<Response>} - resolved, если status < 400, rejected в остальных случаях
     */
    static get(address) {
        return fetch(address, {
            method: 'get',
            credentials: 'include',
            mode: 'cors',
        })
            .then(Http.checkStatus);
    }

    /**
     * Совершает GET запрос по address, с передачей cookies, рассчитан на CORS
     * передает body в формате json и проверяет запрос на статус < 400.
     *
     * @param {string} address - url по которому совершается запрос
     * @param {Object} body - тело запроса
     * @returns {Promise.<Response>}
     */
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

    /**
     * Проверяет результат запроса на код < 400
     *
     * @param {Response} res - запрос
     * @returns {Promise.<Response>}
     */
    static checkStatus(res) {
        if (res.status < 400) {
            return Promise.resolve(res);
        } else {
            return Promise.reject(res);
        }
    }
}

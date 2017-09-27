import {Http} from '../../www/js/modules/http.js';
import {describe, fail, it, expect} from '../helpers/jasmineES6';

describe('Http', () => {

    const buildHttpTestUrl = (path) => 'http://httpbin.org'.concat(path);

    it('отправляет GET-запросы', () => {
        return Http.get(buildHttpTestUrl('/get'))
            .then(resp => {
                expect(resp.status).toBe(200);
            })
            .catch(err => {
                fail(err);

            });
    }, 123456);

    it('отправляет POST-запросы', () => {
        return Http.post(buildHttpTestUrl('/post'))
            .then(resp => {
                expect(resp.status).toBe(200);
            })
            .catch(err => {
                fail(err);
            });
    }, 123456);

    it('прокидывает ответ c Bad Request на GET в catch', () => {
        return Http.get(buildHttpTestUrl('/status/400'))
            .then(resp => {
                fail(resp);
            })
            .catch(expectedErr => {
                expect(expectedErr.status).toBe(400);
            });
    }, 123456);

});
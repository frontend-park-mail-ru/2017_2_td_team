import {Http} from '../../www/js/modules/http.js';

const [describe, it, beforeAll, afterAll, expect, fail] = [window.describe, window.it, window.beforeAll, window.afterAll, window.expect, window.fail];


describe('Http', () => {

    const buildHttpTestUrl = (path) => 'http://httpbin.org'.concat(path);

    it('Отправляет GET-запросы', done => {
        Http.get(buildHttpTestUrl('/get'))
            .then(resp => {
                expect(resp.status).toBe(200);
                done();
            })
            .catch(err => {
                fail(err);
                done();
            });
    },123456);

    it('Отправляет POST-запросы', done => {
        Http.post(buildHttpTestUrl('/post'))
            .then(resp => {
                expect(resp.status).toBe(200);
                done();
            })
            .catch(err => {
                fail(err);
                done();
            });
    },123456);

    it('Прокидывает ответ c Bad Request на GET в catch', done => {
        Http.get(buildHttpTestUrl('/status/400'))
            .then(resp => {
                fail(resp);
                done();
            })
            .catch(expectedErr => {
                expect(expectedErr.status).toBe(400);
                done();
            });
    }, 123456);

});

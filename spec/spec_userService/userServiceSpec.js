import {UserService} from '../../www/js/services/user-service.js';
import {Auth} from '../../www/js/modules/auth.js';

const [describe, it, beforeAll, afterAll, expect, fail] = [window.describe, window.it, window.beforeAll, window.afterAll, window.expect, window.fail];

beforeAll(done => {
    Auth
        .requestSignIn({
            'email-field': 'test@test.ru',
            'password-field': 'password',
        }).then(user => {
        UserService.currentUser = user;
        done(true);
    })
        .catch(errJson => {
            fail(errJson);
            done(false);
        });
}, 123456);

describe('User-Service', () => {

    it('Возвращает текущего пользователя', done => {
        UserService
            .requestCurrentUser()
            .then(user => {
                expect(user instanceof Object).toBe(true);
                expect(Object.keys(user)).toEqual([
                    'login',
                    'email',
                    'id'
                ]);
                done(true);
            })
            .catch(errJson => {
                fail(errJson);
                done(false);
            });
    }, 123456);

    it(' UserService.updateCurrentUser изменяет данные текущего пользователя', done => {
        UserService
            .updateCurrentUser({
                'login': 'test_new'
            })
            .then(user => {
                expect(user instanceof Object).toBe(true);
                expect(Object.keys(user)).toEqual([
                    'login',
                    'email',
                    'id'
                ]);
                expect(user['login']).toEqual('test_new');
                done(true);
            })
            .catch(errJson => {
                fail(errJson);
                done(false);
            });
    });
});

import UserService from '../assets/js/services/user-service.js';
import Auth from '../assets/js/modules/auth.js';
import {beforeAll, fail,describe,it, expect, afterAll } from '../helpers/jasmineES6.js';

describe('User-Service', () => {

    const randomStr = Math.random().toString(36).slice(2);

    const userFormData = {
        'username-field': randomStr,
        'email-field': randomStr + '@nonexisting.ru',
        'password-field': 'password',
        'repeat-password-field': 'password',
    };

    beforeAll(done => {
        Auth.requestSignUp(userFormData)
            .then(() => done())
            .catch(err => {
                fail(err);
                done();
            });
    }, 123456);

    afterAll(done => {
        Auth.requestSignOut()
            .then(() => done())
            .catch(err => {
                fail(err);
                done();
            });
    }, 123456);

    describe('После регистрации', () => {
        it('Возвращает текущего пользователя', () => {
            return UserService
                .requestCurrentUser()
                .then(user => {
                    expect(user instanceof Object).toBe(true);
                    expect(Object.keys(user)).toEqual([
                        'login',
                        'email',
                        'id'
                    ]);
                    UserService.currentUser = user;
                })
                .catch(errJson => {
                    fail(errJson);
                });
        }, 123456);

        it(' UserService.updateCurrentUser изменяет данные текущего пользователя', () => {
            return UserService
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

                })
                .catch(errJson => {
                    fail(errJson);
                });
        }, 123456);
    });
});

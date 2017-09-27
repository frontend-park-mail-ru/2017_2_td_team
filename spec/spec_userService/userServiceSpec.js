import {UserService} from '../../www/js/services/user-service.js';
import {Auth} from '../../www/js/modules/auth.js';

const [describe, it, beforeAll, afterAll, expect, fail] = [window.describe, window.it, window.beforeAll, window.afterAll, window.expect, window.fail];


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
                    UserService.currentUser = user;
                    done();
                })
                .catch(errJson => {
                    fail(errJson);
                    done();
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
                    done();
                })
                .catch(errJson => {
                    fail(errJson);
                    done();
                });
        }, 123456);
    });
});

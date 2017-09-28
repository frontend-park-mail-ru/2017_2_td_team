import {Auth} from '../../www/js/modules/auth.js';
import {beforeEach, describe, expect, fail, it} from '../helpers/jasmineES6.js';

describe('Auth', () => {
    const randomStr = Math.random().toString(36).slice(2);

    beforeEach(done => {
        Auth
            .requestSignOut()
            .then(succ => {
                expect(succ).toBeDefined();
                expect(succ['status']).toBe('Success');
                Auth.requestSignOut()
                    .then(unexpected => {
                        fail(unexpected);
                        done();
                    })
                    .catch(expectedErr => {
                        expect(expectedErr).toBeDefined();
                        expect(expectedErr['type']).toBe('authorization_error');
                        done();
                    });
            })
            .catch(signoutError => {
                expect(signoutError).toBeDefined();
                done();
            });
    }, 123456);

    it('регистрирует пользователя', done => {
        const userFormData = {
            'username-field': randomStr,
            'email-field': randomStr + '@nonexisting.ru',
            'password-field': 'password',
            'repeat-password-field': 'password',
        };
        Auth
            .requestSignUp(userFormData)
            .then(user => {
                expect(user).toBeDefined();
                expect(Object.keys(user)).toEqual([
                    'login',
                    'email',
                    'id'
                ]);
                expect(user['login']).toBe(randomStr);
                expect(user['email']).toBe(randomStr + '@nonexisting.ru');
                done(true);
            })
            .catch(err => {
                fail(err);
                done(false);
            });
    }, 123456);


    it('не аутентифицирует пользователя по неверному паролю', done => {
        Auth.requestSignIn({
            'email-field': randomStr + '@nonexisting.ru',
            'password-field': 'paswrd',
        })
            .then(unsexpectedSucc => {
                fail(unsexpectedSucc);
                done();
            })
            .catch(expectedErr => {
                expect(expectedErr).toBeDefined();
                done();
            });
    }, 123456);

    it('не регистрирует невалидные данные', done => {
        const invalids = [
            {
                'username-field': 'a',
                'email-field': randomStr + 'a@nonexisting.ru',
                'password-field': 'password',
            },
            {
                'username-field': 'login',
                'email-field': randomStr + 'invalid.ru',
                'password-field': 'password',
            },
            {
                'username-field': 'login',
                'email-field': randomStr + 'login@nonexisting.ru',
                'password-field': 'd',
            },
        ];
        Promise
            .all(invalids
                .map(userData => {
                    Auth
                        .requestSignUp(userData)
                        .then(unexpectedSucc => {
                            fail(unexpectedSucc);
                            done();
                        })
                        .catch(expectedErr => {
                            expect(expectedErr).toBeDefined();
                            return expectedErr;
                        });
                })).then(() => done());

    }, 123456);


});

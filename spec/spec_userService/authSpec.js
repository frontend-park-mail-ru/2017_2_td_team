import {Auth} from '../../www/js/modules/auth.js';

const [describe, it, beforeAll, afterAll, expect, fail] = [window.describe, window.it, window.beforeAll, window.afterAll, window.expect, window.fail];


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
                        done(false);
                    })
                    .catch(expectedErr => {
                        expect(expectedErr).toBeDefined();
                        expect(expectedErr['type']).toBe('authorization_error');
                        done(true);
                    });
            })
            .catch(signoutError => {
                expect(signoutError).toBeDefined();
                done(true);
            });
    });

    it('Регистрирует пользователя', done => {
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


    it(' Не аутентифицирует пользователя по неверному паролю', done => {
        Auth.requestSignIn({
            'email-field': randomStr + '@nonexisting.ru',
            'password-field': 'paswrd',
        })
            .then(unsexpectedSucc => {
                fail(unsexpectedSucc);
                done(false);
            })
            .catch(expectedErr => {
                expect(expectedErr).toBeDefined();
                done(true);
            });
    }, 123456);

    it('Не регистрирует невалидные данные', done => {
        const invalids = [
            {
                'username-field': 'a',
                'email-field': 'a@nonexisting.ru',
                'password-field': 'password',
                'repeat-password-field': 'password',
            },
            {
                'username-field': 'login',
                'email-field': 'invalid.ru',
                'password-field': 'password',
                'repeat-password-field': 'password',
            },
            {
                'username-field': 'login',
                'email-field': 'login@nonexisting.ru',
                'password-field': 'd',
                'repeat-password-field': 'd',
            },
            {
                'username-field': 'login',
                'email-field': 'login@nonexisting.ru',
                'password-field': 'password',
                'repeat-password-field': 'randomword',
            },
        ];
        Promise
            .all(invalids
                .map(userData => {
                    Auth
                        .requestSignUp(userData)
                        .then(unexpectedSucc => {
                            fail(unexpectedSucc);
                            done(false);
                        })
                        .catch(expectedErr => {
                            expect(expectedErr).toBeDefined();
                            return expectedErr;
                        });
                })).then(() => done(true));

    }, 123456);


});

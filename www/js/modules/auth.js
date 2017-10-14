import Http from './http.js';
import {SignupFields} from '../configs/signup-fields.js';
import {buildBackendUrl} from '../configs/backend.js';
import {SigninFields} from '../configs/signin-fields.js';

/**
 * Модуль, предоставляющий доступ к API авторизации
 *
 * @module Auth
 */
export default class Auth {

    /**
     * Запрашивает авторизацию пользователя по переданным данным
     *
     * @param {*}formData - данные пользователя для авторизации(email, password)
     * @returns {Promise.<json>}
     */
    static requestSignIn(formData) {

        const email = formData[SigninFields.get('EmailField').name];
        const password = formData[SigninFields.get('PasswordField').name];

        return Http
            .post(buildBackendUrl('/auth/signin'), {email, password})
            .then(res => res.json())
            .catch(err =>
                err.json()
                    .then(errJson => Promise.reject(errJson)));
    }

    /**
     * Запрашивает регистарию пользователя по переданным данным
     *
     * @param {*}formData - данные для регистрации(login, email, password}
     * @returns {Promise.<json>}
     */
    static requestSignUp(formData) {
        const email = formData[SignupFields.get('EmailField').name];
        const password = formData[SignupFields.get('PasswordField').name];
        const login = formData[SignupFields.get('NameField').name];

        return Http
            .post(buildBackendUrl('/auth/signup'), {login, email, password})
            .then(res => res.json())
            .catch(err =>
                err.json()
                    .then(errJson => Promise.reject(errJson)));

    }

    /**
     * Запрашивает завершение текущей пользовательской сессии
     *
     * @returns {Promise.<json>}
     */
    static requestSignOut() {
        return Http.post(buildBackendUrl('/auth/logout'))
            .then(res => res.json())
            .catch(err =>
                err.json()
                    .then(errJson => Promise.reject(errJson)));

    }
}

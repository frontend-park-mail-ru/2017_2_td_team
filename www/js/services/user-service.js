import {Http} from '../modules/http.js';
import {buildBackendUrl} from '../configs/backend.js';

/**
 * Модуль, предоставляющий API для работы с пользователем
 *
 * @module UserService
 */
export class UserService {


    /**
     * Getter для пользователя, установленного как текущего
     * @returns {*}
     */
    static get currentUser() {
        return this._currentUser;
    }

    /**
     * Setter для текущего пользователя
     * @returns {*}
     */
    static set currentUser(currentUser) {
        this._currentUser = currentUser;
    }

    /**
     * Запрос на получение пользователя текущей сессии
     * @link{UserService}
     *
     * @returns {Promise.<json>}
     */
    static requestCurrentUser() {
        return Http
            .get(buildBackendUrl('/user'))
            .then(res => res.json())
            .catch(err =>
                err.json()
                    .then(errJson => Promise.reject(errJson)));
    }

    /**
     * Запрос на обновление данных пользователя текущей сессии
     * и текущего пользователя в UserService.
     * @link{UserService}
     *
     * @param {*} updateData - объект с полями для обновления
     * @returns {Promise.<TResult>}
     */
    static updateCurrentUser(updateData) {
        const current = Object.assign({}, UserService.currentUser);
        if (UserService.currentUser) {
            for (let key in updateData) {
                if (updateData[key] !== current[key]) {
                    current[key] = updateData[key];
                }
            }
            updateData['id'] = current['id'];
        }
        return Http
            .post(buildBackendUrl('/user/edit'), updateData)
            .then(res => {
                UserService.currentUser = current;
                return res.json();
            })
            .catch(err =>
                err.json()
                    .then(errJson => Promise.reject(errJson)));
    }
}

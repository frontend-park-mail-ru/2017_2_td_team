import {Http} from '../modules/http.js';
import {buildBackendUrl} from '../configs/backend.js';

export class UserService {
    static get currentUser() {
        return this._currentUser;
    }

    static set currentUser(currentUser) {
        this._currentUser = currentUser;
    }

    static requestCurrentUser() {
        return Http
            .get(buildBackendUrl('/user'))
            .then(res => res.json())
            .catch(err =>
                err.json()
                    .then(errJson => Promise.reject(errJson)));
    }

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
                UserService.currentUser= current;
                return res.json();
            })
            .catch(err =>
                err.json()
                    .then(errJson => Promise.reject(errJson)));
    }
}

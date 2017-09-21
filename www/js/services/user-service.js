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
        if (UserService.currentUser) {
            for (let key in updateData) {
                if (updateData[key] !== UserService.currentUser[key]) {
                    UserService.currentUser[key] = updateData[key];
                }
            }
            updateData['id'] = UserService.currentUser['id'];
        }
        console.log(UserService.currentUser);
        return Http
            .post(buildBackendUrl('/user/edit'), updateData)
            .then(res => res.json())
            .catch(err =>
                err.json()
                    .then(errJson => Promise.reject(errJson)));
    }
}

import View from '../view/index.js';
import Profile from '../../blocks/profile/profile.js';
import UserService from '../../services/user-service.js';
import {globalEventBus} from '../../modules/globalEventBus.js';

export default class SettingsView extends View {

    render() {
        UserService
            .requestCurrentUser()
            .then(user => {
                UserService.currentUser = user;

                this.profile = new Profile({}, ['profile', 'box']);
                this.profile.injectTo(this._element);

                this.profile.setContent(user);
            })
            //TODO: redirect to error page
            .catch(errJson => {
                console.log(errJson);
                globalEventBus.emit('router:redirect', {path: '/signin'});
            });
    }

    start() {
        this.profile.onUpdate(formdata => {
            UserService
                .updateCurrentUser(formdata)
                .then(this.profile.setContent(UserService.currentUser))
                .catch(err => {
                    console.log(err);
                });
        });
    }

}

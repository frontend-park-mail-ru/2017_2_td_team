import View from '../view/index.js';
import Profile from '../../blocks/profile/index.js';
import UserService from '../../services/user-service.js';

export default class SettingsView extends View {

    render() {
        this.profile = new Profile({}, ['profile', 'box']);
        this.profile.injectTo(this._element);
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

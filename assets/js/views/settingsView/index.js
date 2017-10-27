import View from '../view/index.js';
import Profile from '../../blocks/profile/profile.js';
import Button from '../../blocks/button/button.js';
import UserService from '../../services/user-service.js';
import {globalEventBus} from '../../modules/globalEventBus.js';

export default class SettingsView extends View {

    render() {
        UserService
            .requestCurrentUser()
            .then(user => {
                UserService.currentUser = user;

                this.button = new Button({
                    attrs: {
                        type: 'button',
                    },
                    text: 'Back',
                    classes: ['button', 'menu-button'],
                });

                this.button.on('click', event => {
                    event.preventDefault();
                    globalEventBus.emit('router:redirect', {path: '/'});
                });

                this.profile = new Profile({}, ['profile', 'box']);
                this.profile.injectTo(this._element);

                this.profile.setContent(user);
                this.profile.append(this.button);
            })
            //TODO: redirect to error page
            .catch(errJson => {
                console.log(errJson);
                globalEventBus.emit('router:redirect', {path: '/signin'});
            });


        this.profile.onUpdate(formdata => {
            UserService
                .updateCurrentUser(formdata)
                .then(() => {
                    this.profile.setContent(UserService.currentUser);
                    this.profile.append(this.button);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    start() {

    }

}

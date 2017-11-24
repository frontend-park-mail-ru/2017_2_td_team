import View from '../view/index.js';
import Profile from '../../blocks/profile/profile.js';
import Button from '../../blocks/button/button.js';
import UserService from '../../services/user-service.js';
import globalEventBus from '../../modules/globalEventBus.js';

export default class SettingsView extends View {


    render() {
        console.log('render');
        const button = new Button({
            attrs: {
                type: 'button',
            },
            text: 'Back',
            classes: ['button', 'menu-button'],
        });

        button.on('click', event => {
            event.preventDefault();
            globalEventBus.emit('router:redirect', {path: '/'});
        });
        this.profile = new Profile({}, ['profile', 'box']);
        this.profile.injectTo(this._element);
        this.profile.append(button);
        console.log(UserService.currentUser);
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

    resume() {
        console.log('resume');
        UserService
            .requestCurrentUser()
            .then(user => {
                console.log(user);
                UserService.currentUser = user;
                this.profile.setContent(UserService.currentUser);
            })
            .then(() => super.resume())
            .catch(errJson => {
                console.log(errJson);
                globalEventBus.emit('router:redirect', {path: '/signin'});
            });
    }

}

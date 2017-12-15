import View from '../view/index.js';
import Profile from '../../blocks/profile/profile.js';
import Button from '../../blocks/button/button.js';
import UserService from '../../services/user-service.js';
import globalEventBus from '../../modules/globalEventBus.js';
import Events from '../../events';

export default class SettingsView extends View {


    render() {
        this.bus = globalEventBus;
        const button = new Button({
            attrs: {
                type: 'button',
            },
            text: 'Back',
            classes: ['button', 'menu-button'],
        });

        button.on('click', event => {
            event.preventDefault();
            this.bus.emit('router:redirect', {path: '/'});
        });
        this.profile = new Profile({}, ['profile', 'box']);
        this.profile.injectTo(this._element);
        this.profile.append(button);

        this.profile.onUpdate(formdata => {
            UserService
                .updateCurrentUser(formdata)
                .then(() => {
                    this.profile.setContent(UserService.currentUser);
                    this.profile.append(this.button);
                })
                .catch(err => {
                    this.bus.emit(Events.NOTIFY, {
                        message: JSON.stringify(err),
                        duration: 5,
                    });
                });
        });
    }

    resume() {

        UserService
            .requestCurrentUser()
            .then(user => {
                UserService.currentUser = user;
                this.profile.setContent(UserService.currentUser);
            })
            .then(() => super.resume())
            .catch(() => {
                this.bus.emit(Events.NOTIFY, {
                    message: 'Not authorized!',
                    duration: 5,
                });
                globalEventBus.emit('router:redirect', {path: '/signin'});
            });
    }

}

// Webpack
import 'babel-polyfill';
import '../css/main.styl';
import '../css/font.styl';

import Block from './blocks/block/block.js';
import Logo from './blocks/logo/logo.js';
import Notifications from './blocks/notifications/notifications.js';
import Router from './modules/router.js';
import MainMenuView from './views/mainMenuView/index.js';
import SigninView from './views/signinView/index.js';
import SignupView from './views/signupView/index.js';
import SettingsView from './views/settingsView/index.js';
import AboutView from './views/aboutView/index.js';
import LogoutView from './views/logoutView/index.js';
import globalEventBus from './modules/globalEventBus.js';
import GameView from './views/gameView/index.js';
import Events from './events.js';
import UserService from './services/user-service.js';

const application = document.getElementById('application');
const applicationBlock = new Block(application);

const logo = new Logo('TD', {}, ['logo']);
applicationBlock.append(logo);
globalEventBus.register(Events.LOGO_OFF, () => logo.hide());
globalEventBus.register(Events.LOGO_ON, () => logo.show());

const notifications = new Notifications(application);
globalEventBus.register(Events.NOTIFY, (event, payload) =>
    notifications.notify(payload.message, payload.duration));

const router = new Router(application, application);
router.register('/', 'TD', MainMenuView);
router.register('/signin', 'TD | Signin', SigninView);
router.register('/signup', 'TD | Signup', SignupView);
router.register('/settings', 'TD | Profile', SettingsView);
router.register('/about', 'TD | About', AboutView);
router.register('/logout', 'TD | Logout', LogoutView);
router.register('/game', 'TD| Game', GameView);

UserService
    .requestCurrentUser()
    .then((user) => {
        UserService.currentUser = user;
        router.start();
        globalEventBus.emit('router:redirect', {path: '/'});
    })
    .catch(errJson => {
        console.log('User is not authorized', errJson);

        router.start();
        console.log(window.location);

        if (window.location.pathname !== '/signin' && window.location.pathname !== '/') {
            globalEventBus.emit(Events.NOTIFY, {
                message: 'Please login',
                duration: 5,
            });
        }

        globalEventBus.emit('router:redirect', {path: '/'});
    });

// Webpack
import '../css/main.css';
import '../css/font.css';

import Block from './blocks/block/block.js';
import Logo from './blocks/logo/logo.js';
import Router from './modules/router.js';
import MainMenuView from './views/mainMenuView/index.js';
import SigninView from './views/signinView/index.js';
import SignupView from './views/signupView/index.js';
import SettingsView from './views/settingsView/index.js';
import AboutView from './views/aboutView/index.js';
import LogoutView from './views/logoutView/index.js';
import UserService from './services/user-service.js';
import {globalEventBus} from './modules/globalEventBus.js';
import GameView from './views/gameView/index.js';

const application = document.getElementById('application');
const applicationBlock = new Block(application);
const logo = new Logo('TD', {}, ['logo']);
applicationBlock.append(logo);

const router = new Router(application, application);
router.register('/', 'TD', MainMenuView);
router.register('/signin', 'TD | Signin', SigninView);
router.register('/signup', 'TD | Signup', SignupView);
router.register('/settings', 'TD | Profile', SettingsView);
router.register('/about', 'TD | About', AboutView);
router.register('/logout', 'TD | Logout', LogoutView);
router.register('/game', 'TD| Game', GameView);
router.start();
console.log(window.location.pathname);

UserService
    .requestCurrentUser()
    .then(user => {
        UserService.currentUser = user;
        console.log('User is authorized');
    })
    //TODO: redirect to error page
    .catch(errJson => {
        console.log('User is not authorized', errJson);
        globalEventBus.emit('router:redirect', {path: '/signin'});
    });

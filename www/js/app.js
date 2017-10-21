import Block from './blocks/block/index.js';
import Logo from './blocks/logo/index.js';
import Router from './modules/router.js';
import MainMenuView from './views/mainMenuView/index.js';
import SigninView from './views/signinView/index.js';
import SignupView from './views/signupView/index.js';
import SettingsView from './views/settingsView/index.js';
import AboutView from './views/aboutView/index.js';

const application = document.getElementById('application');
const applicationBlock = new Block(application);
const logo = new Logo('TD', {}, ['logo']);
applicationBlock.append(logo);

const router = new Router(application, application);
router.register('/', MainMenuView);
router.register('/signin', SigninView);
router.register('/signup', SignupView);
router.register('/settings', SettingsView);
router.register('/about', AboutView);

router.start();

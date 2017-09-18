import {Form} from './blocks/form/index.js';
import Block from './blocks/block/index.js';
import {SignupFields} from './configs/signup-fields.js';
import {SigninFields} from './configs/signin-fields.js';
import {SectionsData} from './configs/sections.js';
import {MenuButtons} from './configs/menu-buttons.js';
import {Button} from './blocks/buttons/index.js';
import {Menu} from './blocks/menu/index.js';
import {InputBlock} from './blocks/inputBlock/index.js';
import {SigninButton} from './configs/signin-fields.js';
import {AboutPage} from './blocks/about/index.js';
import {Logo} from './blocks/logo/index.js';


const application = new Block(document.getElementById('application'));

const sections = SectionsData.map(section => Block.Create('section', section));

const routes = sections.reduce(((prev, curr) => {
  prev[curr.id] = curr;
  return prev;
}), {});

sections.forEach(section => application.append(section));

const menuButtons = MenuButtons.map(button => new Button(button));
const menu = new Menu(menuButtons, {}, ['box']);


const signinButton = new Button(SigninButton);
const signinInputs = SigninFields.map(field => new InputBlock(field));
const signinForm = new Form(signinButton, signinInputs, {action: '', method: 'post'});


const signupButton = new Button(SigninButton);
const signupInputs = SignupFields.map(field => new InputBlock(field));
const signupForm = new Form(signupButton, signupInputs, {action: '', method: 'post'});


const about = new AboutPage();

const toSignupButton = new Button(
  {
    attrs: {
      type: 'button',
    },
    text: 'Sign Up',
    classes: ['button', 'register-button'],
  });

const backButton = () => new Button(
  {
    attrs: {
      type: 'button',
    },
    text: 'Back',
    classes: ['button', 'back-button'],
  }
);


const flexWrapper = () => Block.Create('div', {}, ['flex-wrapper']);
const flexed = (block) => flexWrapper().append(block);

const box = () => Block.Create('div', {}, ['box']);
const boxed = (block) => box().append(block);

const withLogo = () => new Logo('TD', {}, ['logo']);

signinForm.append(toSignupButton);

routes['menu-section'].append(flexed(withLogo()).append(menu)).show();
routes['signin-section'].append(flexed(withLogo()).append(boxed(signinForm).append(backButton())));
routes['signup-section'].append(flexed(withLogo()).append(boxed(signupForm).append(backButton())));
routes['about-section'].append(flexed(withLogo()).append(boxed(about).append(backButton())));

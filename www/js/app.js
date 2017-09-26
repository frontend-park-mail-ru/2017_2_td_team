import {Form} from './blocks/form/index.js';
import Block from './blocks/block/index.js';
import {SignupButton, SignupFields} from './configs/signup-fields.js';
import {SigninButton, SigninFields} from './configs/signin-fields.js';
import {SectionsData} from './configs/sections.js';
import {MenuButtons} from './configs/menu-buttons.js';
import {Button} from './blocks/buttons/index.js';
import {Menu} from './blocks/menu/index.js';
import {InputBlock} from './blocks/inputBlock/index.js';
import {AboutPage} from './blocks/about/index.js';
import {Logo} from './blocks/logo/index.js';
import {Profile} from './blocks/profile/index.js';
import {UserService} from './services/user-service.js';
import {Auth} from './modules/auth.js';

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
const signinInputs = Array.from(SigninFields.values()).map(field => new InputBlock(field));
const signinForm = new Form(signinButton, signinInputs, {action: '', method: 'post'}, ['default-form']);


const signupButton = new Button(SignupButton);
const signupInputs = Array.from(SignupFields.values()).map(field => new InputBlock(field));
const signupForm = new Form(signupButton, signupInputs, {action: '', method: 'post'}, ['default-form']);

const profile = new Profile(window.profileTemplate);


const toggleOn = id => {
    for (let key in routes) {
        (routes[key].id === id) ? routes[key].show() : routes[key].hide();
    }
};
const menuToggle = () => toggleOn('menu-section');
const signinToggle = () => toggleOn('signin-section');
const signupToggle = () => toggleOn('signup-section');
const aboutToggle = () => toggleOn('about-section');
const settignsToggle = () => toggleOn('settings-section');
const about = new AboutPage();

const toSignupButton = new Button(
    {
        attrs: {
            type: 'button',
        },
        text: 'Sign Up',
        classes: ['button', 'form-button'],
    });
toSignupButton.on('click', signupToggle);


const flexWrapper = () => Block.Create('div', {}, ['flex-wrapper']);
const flexed = (block) => flexWrapper().append(block);

const box = () => Block.Create('div', {}, ['box']);
const boxed = (block) => box().append(block);

const withLogo = () => new Logo('TD', {}, ['logo']);

signinForm.append(toSignupButton);

const backButton = (prevSection) => {

    const button = new Button(
        {
            attrs: {
                type: 'button',
            },
            text: 'Back',
            classes: ['button', 'menu-button'],
        });
    button.on('click', event => {
        event.preventDefault();
        toggleOn(prevSection);
    });
    return button;
};

menu.on('click', event => {
    event.preventDefault();
    const section = event.target.getAttribute('data-section');
    switch (section) {
        case 'about':
            aboutToggle();
            break;
        case 'settings':
            UserService
                .requestCurrentUser()
                .then(user => {
                    console.log(user);
                    profile.setContent(user);
                    settignsToggle();
                })
                //TODO: redirect to error page
                .catch(errJson => console.log(errJson));
            break;
        case 'logout':
            Auth
                .requestSignOut()
                //TODO: redirect to error page
                .catch(err => err
                    .json()
                    .then(errBody => console.log(errBody)));
            signinToggle();
            break;
    }
});


routes['menu-section'].append(flexed(withLogo()).append(menu));
routes['signin-section'].append(flexed(withLogo()).append(boxed(signinForm)));
routes['signup-section'].append(flexed(withLogo()).append(boxed(signupForm).append(backButton('signin-section'))));
routes['about-section'].append(flexed(withLogo()).append(boxed(about).append(backButton('menu-section'))));
routes['settings-section'].append(flexed(withLogo()).append(boxed(profile).append(backButton('menu-section'))));

UserService
    .requestCurrentUser()
    .then(user => {
        UserService.currentUser = user;
        profile.setContent(user);
        menuToggle();
    })
    //TODO: redirect to error page
    .catch(errJson => {
        console.log(errJson);
        signinToggle();
    });


signinForm.onSubmit(formdata => {
    Auth
        .requestSignIn(formdata)
        .then(user => {
            UserService.currentUser = user;
            menuToggle();
        })
        //TODO: show error in form
        .catch(err => console.log(err));
});

profile.onUpdate(formdata => {
    UserService
        .updateCurrentUser(formdata)
        .then(profile.setContent(UserService.currentUser))
        //TODO: show error in form
        .catch(err => console.log(err));
});

signupForm.onSubmit(formdata => {
    Auth
        .requestSignUp(formdata)
        .then(user => {
            UserService.currentUser = user;
            menuToggle();
        })
        //TODO: show error in form
        .catch(err => console.log(err));
});

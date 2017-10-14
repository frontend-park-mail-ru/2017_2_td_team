import Form from './blocks/form/index.js';
import Block from './blocks/block/index.js';
import Button from './blocks/buttons/index.js';
import Menu from './blocks/menu/index.js';
import InputBlock from './blocks/inputBlock/index.js';
import AboutPage from './blocks/about/index.js';
import Logo from './blocks/logo/index.js';
import LogoSpinner from './blocks/logo-spinner/index.js';
import Profile from './blocks/profile/index.js';
import UserService from './services/user-service.js';
import Auth from './modules/auth.js';

import {
    SignupButton,
    SignupFields
} from './configs/signup-fields.js';
import {
    SigninButton,
    SigninFields
} from './configs/signin-fields.js';
import {SectionsData} from './configs/sections.js';
import {MenuButtons} from './configs/menu-buttons.js';


const application = new Block(document.getElementById('application'));

const sections = SectionsData.map(section => Block.Create('section', section));
sections.forEach(section => application.append(section));

const routes = sections.reduce(((prev, curr) => {
    prev[curr.id] = curr;
    return prev;
}), {});

const menuButtons = MenuButtons.map(button => new Button(button));
const menu = new Menu(menuButtons, {}, ['box']);

const signinButton = new Button(SigninButton);
const signinInputs = Array.from(SigninFields.values()).map(field => new InputBlock(field));
const signinForm = new Form(signinButton, signinInputs, {action: '', method: 'post'}, ['default-form']);

const signupButton = new Button(SignupButton);
const signupInputs = Array.from(SignupFields.values()).map(field => new InputBlock(field));
const signupForm = new Form(signupButton, signupInputs, {action: '', method: 'post'}, ['default-form']);

const profile = new Profile(window.profileTemplate);

const logoSpinner = new LogoSpinner();

const toggleOn = id => {
    for (let key in routes) {
        if (routes[key].id === id) {
            routes[key].show();
        } else {
            routes[key].hide();
        }
    }
};
const menuToggle = () => toggleOn('menu-section');
const signinToggle = () => toggleOn('signin-section');
const signupToggle = () => toggleOn('signup-section');
const aboutToggle = () => toggleOn('about-section');
const settingsToggle = () => toggleOn('settings-section');
const spinnerToggle = () => toggleOn('spinner-section');
const about = new AboutPage();

const toSignupButton = new Button({
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

    const button = new Button({
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
                    profile.setContent(user);
                    settingsToggle();
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
routes['spinner-section'].append(flexed(logoSpinner));

spinnerToggle();
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

            signinForm.reset();
            menuToggle();
        })
        .catch(err => {
            err.incorrectRequestDataErrors.forEach(err => {
                let inputName = '';

                switch (err.fieldName) {
                    case 'email':
                        inputName = 'email-field';
                        break;
                    case 'password':
                        inputName = 'password-field';
                        break;
                }

                signinForm._element[inputName].setCustomValidity(err.description);
                signinForm._element[inputName].reportValidity();
            });
        });
});

signinForm.onInput(input => {
    if (input.value) {
        input.setCustomValidity('');
    } else {
        input.setCustomValidity('Field is empty');
    }
});

profile.onUpdate(formdata => {
    UserService
        .updateCurrentUser(formdata)
        .then(profile.setContent(UserService.currentUser))
        .catch(err => {
            console.log(err);
        });
});

signupForm.onSubmit(formdata => {
    Auth
        .requestSignUp(formdata)
        .then(user => {
            UserService.currentUser = user;
            signupForm.reset();
            menuToggle();
        })
        .catch(err => {
            err.incorrectRequestDataErrors.forEach(err => {
                let inputName = '';

                switch (err.fieldName) {
                    case 'email':
                        inputName = 'email-field';
                        break;
                    case 'password':
                        inputName = 'password-field';
                        break;
                    case 'login':
                        inputName = 'username-field';
                        break;
                }

                signupForm._element[inputName].setCustomValidity(err.description);
                signupForm._element[inputName].reportValidity();
            });
        });
});

signupForm.onInput((input, form) => {
    if (input.value) {
        input.setCustomValidity('');
        const passwordField = SignupFields.get('PasswordField').name;
        const repeatePasswordField = SignupFields.get('RepeatPasswordField').name;
        const loginField = SignupFields.get('NameField').name;
        const validatePasswordsEquality = () => {
            const password = form.elements[passwordField];
            const repeatPassword = form.elements[repeatePasswordField];

            if (password.value !== repeatPassword.value) {
                repeatPassword.setCustomValidity('Passwords are not equal');
            }
        };
        switch (input.name) {
            case passwordField: {
                const passwordLength = input.value.length;
                if (passwordLength > 25) {
                    input.setCustomValidity('Password too long');
                    break;
                } else if (passwordLength < 5) {
                    input.setCustomValidity('Password too short');
                    break;
                }
                validatePasswordsEquality();
                break;
            }
            case repeatePasswordField: {
                validatePasswordsEquality();
                break;
            }
            case loginField: {
                const loginLength = input.value.length;
                if (loginLength < 3 || loginLength > 25) {
                    input.setCustomValidity('Login is too short');
                }
                break;
            }
        }

    } else {
        input.setCustomValidity('Field is empty');
    }
});

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
const signin = (formdata) => {
    const email = formdata[SignupFields.get('EmailField').name];
    const password = formdata[SignupFields.get('PasswordField').name];

    if (!email) {
        return Promise.reject(new Error('Email field is empty'));
    }

    if (!password) {
        return Promise.reject(new Error('Password field is empty'));
    }
    fetch(buildBackUrl('/auth/signin'), initPost({email, password}))
        .then(res => res.json())
        .then(user => {
            profile.setContent(user);
            menuToggle();
        })
        .catch(err => console.log(err));
};
const signup = (formdata) => {
    const email = formdata[SignupFields.get('EmailField').name];
    const password = formdata[SignupFields.get('PasswordField').name];
    const login = formdata[SignupFields.get('PasswordField').name];
    const repeatePassword = formdata[SignupFields.get('RepeatPasswordField').name];

    if (!login) {
        return Promise.reject(new Error('Name field is empty'));
    }

    if (!email) {
        return Promise.reject(new Error('Email field is empty'));
    }

    if (!password) {
        return Promise.reject(new Error('Password field is empty'));
    }

    if (!repeatePassword) {
        return Promise.reject(new Error('Repeat password field is empty'));
    }

    if (repeatePassword !== password) {
        return Promise.reject(new Error('Passwords are not equal'));
    }
    fetch(buildBackUrl('/auth/signup'), initPost({email, password, login}))
        .then(res => res.json())
        .then(user => {
            profile.setContent(user);
            menuToggle();
        })
        .catch(err => console.log(err));
};
const updateProfile = () => {
    fetch(buildBackUrl('/user'), initGet())
        .then(res => res.json())
        .then(user => {
            profile.setContent(user);
        })
        .catch(err => console.log(err));
};
const signout = () => {
    fetch(buildBackUrl('/logout'), initPost({}))
        .then(res => res.json())
        .then(res => {
            console.log(res);
            signinToggle();
        })
        .catch(err => console.log(err));
};

menu.on('click', event => {
    event.preventDefault();
    const section = event.target.getAttribute('data-section');
    switch (section) {
        case 'about':
            aboutToggle();
            break;
        case 'settings':
            updateProfile();
            settignsToggle();
            break;
        case 'logout':
            signout();
            signinToggle();
            break;
    }
});


routes['menu-section']
    .append(flexed(withLogo())
        .append(menu))
routes['signin-section'].append(flexed(withLogo()).append(boxed(signinForm)));
routes['signup-section'].append(flexed(withLogo()).append(boxed(signupForm).append(backButton('signin-section'))));
routes['about-section'].append(flexed(withLogo()).append(boxed(about).append(backButton('menu-section'))));
const backendURL = 'https://td-java.herokuapp.com';
const buildBackUrl = (path) => backendURL.concat(path);

const initGet = () => {
    return {
        headers: {'Content-Type': 'application/json'},
        method: 'get',
        mode: 'cors',
        credentials: 'include',

    };
};
const initPost = (body) => {
    return {
        headers: {'Content-Type': 'application/json'},
        method: 'post',
        body: JSON.stringify(body),
        mode: 'cors',
        credentials: 'include',

    };
};

fetch(buildBackUrl('/user'), initGet())
    .then(res => res.json())
    .then(res => {
        profile.setContent(res);
    })
    .catch(err => {
        console.log(err);
        signinToggle();
    });


signinForm.onSubmit(signin);
signupForm.onSubmit(signup);

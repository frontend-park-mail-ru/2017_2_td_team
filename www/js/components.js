'use strict';

function renderSignupForm(section) {
    const inputs = [
        ['Name', 'text', 'name-field'],
        ['E-Mail', 'email', 'email-field'],
        ['Password', 'password', 'password-field'],
        ['Repeat password', 'password', 'repeat-password-field'],
    ];

    const submit = createInput('submit', 'signup-button', ['register-button', 'button']);

    const form = createInputForm(inputs, [submit], ['login-form']);

    submit.setAttribute('value', 'Sign Up');

    const back = createButton(['Back', ['back-button'], displayLoginView]);

    section.appendChild(form);
    section.appendChild(back);

    form.addEventListener('submit', signup);


    return form
}

function renderSigninForm(section) {
    const fields = [
        ['E-Mail', 'email', 'email-field'],
        ['Password', 'password', 'password-field'],
    ];

    const submit = createInput('submit', 'login-button', ['login-button', 'button']);
    submit.setAttribute('value', 'Sign In');

    const signupButton = createButton(['Sign Up', ['button'], displaySignupView]);

    const form = createInputForm(fields, [submit, signupButton], ['login-form']);
    section.appendChild(form);

    form.addEventListener('submit', signin);
    return form
}

function renderMainMenu(section) {
    [
        ['Start', ['start-button'], startGame],
        ['Help', ['help-button'], displayHelpView],
        // ['Settings', 'settings-button', displaySettingsView],
        ['About', ['about-button'], displayAboutView],
        ['Logout', ['logout-button'], signout],
    ].forEach(buttonScheme => section.appendChild(
        createButton(buttonScheme)
    ));

    return section
}

function renderAboutPage(section) {

    const about = document.createElement('div');
    about.innerText = "TD is multiplayer tower defense game";

    const br = document.createElement('br');

    const repLink = document.createElement('a');
    repLink.setAttribute('href', 'https://github.com/frontend-park-mail-ru/2017_2_td_team');
    repLink.innerText = "Github Repo";

    const back = createButton(['Back', ['back-button'], displayMainMenuView]);

    section.appendChild(about);
    section.appendChild(back);

    about.appendChild(br);
    about.appendChild(repLink);

    return about
}

function renderBox(section) {
    const box = document.createElement('div');
    box.classList.add('box');
    section.appendChild(box);
    return box
}

function renderLogo(section) {
    const logo = document.createElement('img');
    logo.classList.add('logo');
    logo.setAttribute('src', 'img/TD2.png');
    section.insertBefore(logo, section.firstChild);
    return logo
}

function renderFlexWrapper(section) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('flex-wrapper');
    section.appendChild(wrapper);
    return wrapper
}


function createInputForm(inputs, buttons = [], classes = []) {
    const form = document.createElement('form');
    form.setAttribute('action', '');
    classes.forEach(className => form.classList.add(className));

    const appendInputBlock = elem => form.appendChild(
        createInputBlock(
            createLabel(elem[2], elem[0]),
            createInput(elem[1], elem[2]),
        ));
    inputs.forEach(appendInputBlock);
    buttons.forEach(elem => form.appendChild(elem));
    return form
}


function createInputBlock(label, input) {
    const inputBlock = document.createElement('div');
    inputBlock.classList.add('input-block');
    inputBlock.appendChild(label);
    inputBlock.appendChild(input);
    return inputBlock
}

function createLabel(labelFor, labelText) {
    const label = document.createElement('label');
    label.innerText = labelText;
    label.setAttribute('for', labelFor);
    return label
}

function createButton(buttonScheme) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.innerText = buttonScheme[0];

    buttonScheme[1].forEach(className => button.classList.add(className));
    button.classList.add('button');

    button.addEventListener('click', buttonScheme[2]);
    return button
}

function createInput(type, name, classes = []) {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('name', name);
    classes.forEach(className => input.classList.add(className));
    return input
}


'use strict';

const application = document.getElementById('application');


const sections = document.getElementsByTagName('section');
const components = [
    ['signin-section', renderSigninForm],
    ['signup-section', renderSignupForm],
    ['main-menu-section', renderMainMenu],
    ['about-section', renderAboutPage],
    //TODO: ['help-section', renderHelpPage]
    //TODO: ['settings-section', renderSettingsPage]
];


function displayLoginView() {
    Array.from(sections).forEach(elem => elem.hidden = elem.id !== 'signin-section')
}

function displayMainMenuView() {
    Array.from(sections).forEach(elem => elem.hidden = elem.id !== 'main-menu-section')
}

function displayAboutView() {
    Array.from(sections).forEach(elem => elem.hidden = elem.id !== 'about-section')
}

function displaySignupView() {
    Array.from(sections).forEach(elem => elem.hidden = elem.id !== 'signup-section')
}

function displayHelpView() {
    console.log('signup view');
}

function displaySettingsView() {
    console.log('signup view');
}

function startGame() {
    alert("It works!");
}

window.onload = function () {

    components.forEach(component => {
        const node = document.getElementById(component[0]);
        const flexWrapper = renderFlexWrapper(node);
        renderLogo(flexWrapper);
        const box = renderBox(flexWrapper);
        component[1](box)
    });

    displayLoginView();
};

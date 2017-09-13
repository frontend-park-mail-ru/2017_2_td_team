'use strict';

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

function createInput(type, name, classes = []) {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('name', name);
    for (let className of classes) {
        input.classList.add(className);
    }
    return input
}

function createSignupForm() {

    const fields = [
        ['Name', 'text', 'name-field'],
        ['E-Mail', 'email', 'email-field'],
        ['Password', 'password', 'password-field'],
        ['Repeat password', 'password', 'repeate-password-field'],
    ];

    const form = document.createElement('form');
    const appendInputBlock = elem => form.appendChild(
        createInputBlock(
            createLabel(elem[2], elem[0]),
            createInput(elem[1], elem[2]),
        ));

    form.setAttribute('action', ' ');
    form.classList.add('login-form');
    fields.forEach(appendInputBlock);
    application.querySelector('.box').appendChild(form);
}

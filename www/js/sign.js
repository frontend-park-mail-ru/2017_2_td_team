'use strict';

function signup(form, event) {
    alert('signup');
    event.preventDefault();
    console.log(form.elements);
    console.log(event);
}

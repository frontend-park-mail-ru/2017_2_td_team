'use strict';

function signup(event) {
    event.preventDefault();

    const form = event.target;
    if (form.elements['password-field'].value
        !== form.elements['repeat-password-field'].value) {
        console.log('password fail');
        return
    }

    const signupJson = {
        'username': form.elements['name-field'].value,
        'password': form.elements['password-field'].value,
        'email': form.elements['email-field'].value,
    };


    fetch('/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(signupJson),
        credentials: 'include',
    }).then(rep => {
            if (rep.status !== 200) {
                //TODO: proper error handling on signup
                alert('bad credentials');
                return
            }
            form.reset();
            displayMainMenuView();
        }
    )
}

function signin(event) {
    event.preventDefault();

    const form = event.target;

    const signinJson = {

        'email': form.elements['email-field'].value,
        'password': form.elements['password-field'].value,
    };

    fetch('/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(signinJson),
        credentials: 'include',
    }).then(rep => {
            if (rep.status !== 200) {
                //TODO: proper error handling on signin
                alert('bad credentials');
                return
            }
            form.reset();
            displayMainMenuView();
        }
    )
}

function signout(event) {
    event.preventDefault();
    fetch('/logout', {
        method: 'POST',
        credentials: 'include',
    }).then(rep => {
            if (rep.status !== 200) {
                //TODO: proper error handling on signout
                alert('bad session');
                return
            }
            displayLoginView();
        }
    )
}

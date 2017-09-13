'use strict';

let application = {};

function displayLoginView() {
    application.innerHTML = `
    <img class="logo" src="img/TD2.png"></img><br>
    <div class="box">
        <form class="login-form" action="/login">
            <div class="input-block">
                <label>Login</label>
                <input type="text" name="login-field">
            </div>
            
            <div class="input-block">
                <label>Password</label>
                <input type="password" name="password-field">
            </div>

            <input class="button login-button" type="submit" value="Log in">
            <button class="button register-button" type="submit">Register</button>
        </form>
    </div>
    `;

    application.querySelector('.login-button').addEventListener('click', displayMainMenuView);
    application.querySelector('.register-button').addEventListener('click', displayRegisterView);
};

function displayMainMenuView() {
    application.innerHTML = `
    <img class="logo" src="img/TD2.png"></img>
    <div class="box">
        <button class="button start-button">Start</button>
        <button class="button help-button">Help</button>
        <button class="button settings-button">Settings</button>
        <button class="button about-button">About</button>
        <button class="button logout-button">Log out</button>
    </div>
    `;

    application.querySelector('.start-button').addEventListener('click', startGame);

    application.querySelector('.about-button').addEventListener('click', displayAboutView);

    application.querySelector('.logout-button').addEventListener('click', displayLoginView);
};

function displayAboutView() {
    application.innerHTML = `
    <img class="logo" src="img/TD2.png"></img><br>
    <div class="box">
        <div class="about-block">
           TD is multiplayer tower defense game
            <br>
            <a href="https://github.com/frontend-park-mail-ru/2017_2_td_team">
                Github Repo
            </a>
        </div>
        <button class="button back-button">Back</button>
    </div>
    `;

    application.querySelector('.back-button').addEventListener('click', displayMainMenuView);
};

function displayRegisterView() {
    console.log('lolkek');
}

function startGame() {
    alert("It works!");
};

window.onload = function() {
    application = document.getElementById('application');

    const logedIn = false;

    if (logedIn)
        displayMainMenuView();
    else
        displayLoginView();
};

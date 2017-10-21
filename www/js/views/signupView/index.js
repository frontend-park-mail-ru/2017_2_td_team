import View from '../view/index.js';
import Button from '../../blocks/button/index.js';
import Form from '../../blocks/form/index.js';
import InputBlock from '../../blocks/inputBlock/index.js';
import UserService from '../../services/user-service.js';
import Auth from '../../modules/auth.js';
import {globalEventBus} from '../../modules/globalEventBus.js';
import {SignupButton, SignupFields} from '../../configs/signup-fields.js';

export default class SignupView extends View {
    render() {
        const signupButton = new Button(SignupButton);
        const signupInputs = Array.from(SignupFields.values()).map(field => new InputBlock(field));
        this.signupForm = new Form(signupButton, signupInputs, {action: '', method: 'post'}, ['default-form', 'box']);

        this.signupForm.injectTo(this._element);
    }

    start() {
        this.signupForm.onSubmit(formdata => {
            Auth
                .requestSignUp(formdata)
                .then(user => {
                    UserService.currentUser = user;

                    this.signupForm.reset();
                    globalEventBus.emit('router:redirect', {path: '/'});
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

                        this.signupForm._element[inputName].setCustomValidity(err.description);
                        this.signupForm._element[inputName].reportValidity();
                    });
                });
        });

        this.signupForm.onInput((input, form) => {
            if (input.value) {
                input.setCustomValidity('');
                const passwordField = SignupFields.get('PasswordField').name;
                const repeatPasswordField = SignupFields.get('RepeatPasswordField').name;
                const loginField = SignupFields.get('NameField').name;
                const validatePasswordsEquality = () => {
                    const password = form.elements[passwordField];
                    const repeatPassword = form.elements[repeatPasswordField];

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
                    case repeatPasswordField: {
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
    }
}

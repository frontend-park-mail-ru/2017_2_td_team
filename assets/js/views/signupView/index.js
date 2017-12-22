import View from '../view/index.js';
import SubmitButton from '../../blocks/form/__submit-button/form__submit-button.js';
import Form from '../../blocks/form/form.js';
import InputBlock from '../../blocks/form/__input-block/form__input-block.js';
import UserService from '../../services/user-service.js';
import Auth from '../../modules/auth.js';
import globalEventBus from '../../modules/globalEventBus.js';
import {SelectField, SignupButton, SignupFields} from '../../configs/signup-fields.js';
import Events from '../../events.js';
import SelectBlock from '../../blocks/form/__select-block/form__select-block';
import apiErrorParser from '../../services/errorParsingService';

export default class SignupView extends View {
    render() {
        const signupButton = new SubmitButton(SignupButton);
        const signupInputs = Array.from(SignupFields.values()).map(field => new InputBlock(field));
        const select = new SelectBlock(SelectField);
        select.hide();
        signupInputs.push(select);

        this.signupForm = new Form(signupButton, signupInputs, {action: '', method: 'post'}, ['default-form', 'box']);

        this.signupForm.injectTo(this._element);
        this.signupForm.onSubmit(formdata => {
            Auth
                .requestSignUp(formdata)
                .then(user => {
                    UserService.currentUser = user;
                    this.signupForm.reset();
                    globalEventBus.emit(Events.REDIRECT, {path: '/'});
                })
                .catch(errResponse => {
                    const [descriptions] = apiErrorParser.parseError(errResponse);
                    if (descriptions instanceof Array) {
                        descriptions.map(description => {
                            globalEventBus.emit(Events.NOTIFY, {
                                message: description,
                                duration: 15,
                            });
                        });
                        return;
                    }
                    globalEventBus.emit(Events.NOTIFY, {
                        message: 'Internal Error, try again',
                        duration: 10,
                    });
                    console.error(errResponse);
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
                            input.setCustomValidity('Login must be > 3');
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

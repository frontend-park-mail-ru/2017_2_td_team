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

export default class SignupView extends View {
    render() {
        const signupButton = new SubmitButton(SignupButton);
        const signupInputs = Array.from(SignupFields.values()).map(field => new InputBlock(field));
        signupInputs.push(new SelectBlock(SelectField));

        this.signupForm = new Form(signupButton, signupInputs, {action: '', method: 'post'}, ['default-form', 'box']);

        this.signupForm.injectTo(this._element);
        this.signupForm.onSubmit(formdata => {
            Auth
                .requestSignUp(formdata)
                .then(user => {
                    UserService.currentUser = user;
                    this.signupForm.reset();
                    globalEventBus.emit('router:redirect', {path: '/'});
                })
                .catch(errResponse => {
                    let errors = [];
                    if (errResponse.incorrectRequestDataErrors) {
                        errors = errResponse.incorrectRequestDataErrors;
                    } else if (errResponse.fieldName) {
                        errors.push(errResponse);
                    } else {
                        globalEventBus.emit(Events.NOTIFY, {
                            message: 'Internal error: try again',
                            duration: 5,
                        });
                    }
                    errors.forEach(err => {
                        let inputName = '';
                        switch (err.fieldName) {
                            case 'email':
                                inputName = SignupFields.get('EmailField').name;
                                break;
                            case 'password':
                                inputName = SignupFields.get('PasswordField').name;
                                break;
                            case 'login':
                                inputName = SignupFields.get('NameField').name;
                                break;
                        }
                        this.signupForm._element.elements[inputName].setCustomValidity(err.description);
                        this.signupForm._element.elements[inputName].reportValidity();
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

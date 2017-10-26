export const SignupFields = new Map([
    ['NameField', {
        type: 'text',
        label: 'Name',
        name: 'username-field',
        classes: ['form__input-block']
    }],
    ['EmailField', {
        type: 'email',
        label: 'E-Mail',
        name: 'email-field',
        classes: ['form__input-block']
    }],
    ['PasswordField', {
        type: 'password',
        label: 'Password',
        name: 'password-field',
        classes: ['form__input-block']
    }],
    ['RepeatPasswordField', {
        type: 'password',
        label: 'Repeat Password',
        name: 'repeat-password-field',
        classes: ['form__input-block']
    }]
]);

export const SignupButton = {
    attrs: {
        type: 'submit'
    },
    text: 'Sign Up',
    classes: ['button', 'form-button'],
};

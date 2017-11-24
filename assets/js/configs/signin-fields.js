export const SigninFields = new Map([
    ['EmailField', {
        type: 'email',
        label: 'E-Mail',
        name: 'email',
        classes: ['form__input-block'],
    }],
    ['PasswordField', {
        type: 'password',
        label: 'Password',
        name: 'current-password',
        classes: ['form__input-block'],
    }],
]);

export const SigninButton = {
    attrs: {
        type: 'submit'
    },
    text: 'Sign In',
    classes: ['button', 'form__submit-button'],
};

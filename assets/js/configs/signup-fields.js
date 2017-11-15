export const SignupFields = new Map([
    ['NameField', {
        type: 'text',
        label: 'Name',
        name: 'username',
        classes: ['form__input-block']
    }],
    ['EmailField', {
        type: 'email',
        label: 'E-Mail',
        name: 'email',
        classes: ['form__input-block']
    }],
    ['PasswordField', {
        type: 'password',
        label: 'Password',
        name: 'new-password',
        classes: ['form__input-block']
    }],
    ['RepeatPasswordField', {
        type: 'password',
        label: 'Repeat Password',
        name: 'new-password',
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

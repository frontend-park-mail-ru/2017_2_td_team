export const SignupFields = [
    {
        type: 'text',
        label: 'Name',
        name: 'username-field',
        classes: ['input-block']
    },
    {
        type: 'email',
        label: 'E-Mail',
        name: 'email-field',
        classes: ['input-block']
    },
    {
        type: 'password',
        label: 'Password',
        name: 'password-field',
        classes: ['input-block']
    },
    {
        type: 'password',
        label: 'Repeat Password',
        name: 'repeat-password-field',
        classes: ['input-block']
    },
];

export const SignupButton = {
    attrs: {
        type: 'submit'
    },
    text: 'Sign Up',
    classes: ['button', 'form-button'],
};

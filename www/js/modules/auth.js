import Http from './http.js';
import SigninFields from '../configs/signin-fields.js';
import SignupFields from '../configs/signup-fields.js';

export class Auth {
    static signIn(formData) {
        if (formData[SigninFields['EmailField'].name])
            return Promise.reject(new Error('Email field is empty'));

        if (formData[SigninFields['PasswordField'].name])
            return Promise.reject(new Error('Password field is empty'));

        return Http.post('http://td-java.herokuapp.com/auth/signin', formData);
    }

    static signUp(formData) {
        if (formData[SignupFields['NameField'].name])
            return Promise.reject(new Error('Name field is empty'));

        if (formData[SignupFields['EmailField'].name])
            return Promise.reject(new Error('Email field is empty'));

        if (formData[SignupFields['PasswordField'].name])
            return Promise.reject(new Error('Password field is empty'));

        if (formData[SignupFields['RepeatPasswordField'].name])
            return Promise.reject(new Error('Repeat password field is empty'));

        if (formData[SignupFields['RepeatPasswordField'].name] !==
                formData[SignupFields['PasswordField'].name])
            return Promise.reject(new Error('Passwords are not equal'));

        return Http.post('http://td-java.herokuapp.com/auth/signup', formData);
    }

    static signOut() {
        return Http.post('http://td-java.herokuapp.com/logout');
    }
}

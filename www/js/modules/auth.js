import Http from './http.js';
import SignupFields from '../configs/signup-fields.js';

export class Auth {
    static signIn(formData) {

        const email = formData[SignupFields.get('EmailField').name];
        const password = formData[SignupFields.get('PasswordField').name];

        if (!email) {
            return Promise.reject(new Error('Email field is empty'));
        }

        if (!password) {
            return Promise.reject(new Error('Password field is empty'));
        }

        return Http.post('http://td-java.herokuapp.com/auth/signin', {email, password});
    }

    static signUp(formData) {
        const email = formData[SignupFields.get('EmailField').name];
        const password = formData[SignupFields.get('PasswordField').name];
        const login = formData[SignupFields.get('PasswordField').name];
        const repeatePassword = formData[SignupFields.get('RepeatPasswordField').name];

        if (!login) {
            return Promise.reject(new Error('Name field is empty'));
        }

        if (!email) {
            return Promise.reject(new Error('Email field is empty'));
        }

        if (!password) {
            return Promise.reject(new Error('Password field is empty'));
        }

        if (!repeatePassword) {
            return Promise.reject(new Error('Repeat password field is empty'));
        }

        if (repeatePassword !== password) {
            return Promise.reject(new Error('Passwords are not equal'));
        }
        //http://td-java.herokuapp.com/auth/signup'
        return Http.post('http://localhost:8080/auth/signup', {login, email, password});
    }

    static signOut() {
        return Http.post('http://td-java.herokuapp.com/logout');
    }
}

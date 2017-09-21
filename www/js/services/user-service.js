import {Http} from '../modules/http';

export class UserService {
    static requestCurrentUser(){
        return Http.get('http://td-java.herokuapp.com/auth/signin');
    }
}

import View from '../view/index.js';
import Auth from '../../modules/auth.js';
import {globalEventBus} from '../../modules/globalEventBus.js';

export default class LogoutView extends View {

    render() {
        Auth
            .requestSignOut()
            //TODO: redirect to error page
            .catch(err => err
                .json()
                .then(errBody => console.log(errBody)));

        globalEventBus.emit('router:redirect', {path: '/signin'});
    }

}

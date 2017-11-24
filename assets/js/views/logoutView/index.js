import View from '../view/index.js';
import Auth from '../../modules/auth.js';
import globalEventBus from '../../modules/globalEventBus.js';

export default class LogoutView extends View {

    resume() {
        Auth
            .requestSignOut()
            .then(globalEventBus.emit('router:redirect', {path: '/signin'}))
            .catch(err => err
                .json()
                .then(errBody => console.log(errBody)));
    }

}

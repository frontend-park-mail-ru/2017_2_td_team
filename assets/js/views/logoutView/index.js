import View from '../view/index.js';
import Auth from '../../modules/auth.js';
import globalEventBus from '../../modules/globalEventBus.js';

export default class LogoutView extends View {

    resume() {
        const redirection = () => globalEventBus.emit('router:redirect', {path: '/signin'});
        Auth
            .requestSignOut()
            .then(() => redirection())
            .catch(() => redirection());
    }

}

import View from '../view/index.js';
import Game from '../../modules/gameModules/game.js';
import LocalGameServer from '../../modules/gameModules/localServer/localServer.js';
import UserService from '../../services/user-service.js';
import {Events} from '../../events.js';

export default class GameView extends View {
    constructor(parent) {
        super(parent);
        this._canvas = parent;
    }

    resume() {
        this._game = new Game(this._canvas, LocalGameServer, UserService.currentUser);
        this._bus.emit(Events.LOGO_OFF);
        super.resume();
    }

    pause() {
        this._game.destroy();
        this._bus.emit(Events.LOGO_ON);
        super.pause();
    }

}

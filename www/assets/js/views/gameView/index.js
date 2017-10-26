import View from '../view/index.js';
import Game from '../../modules/gameModules/game.js';
import LocalGameServer from '../../modules/gameModules/localServer/localServer.js';
import UserService from '../../services/user-service.js';

export default class GameView extends View {
    constructor(parent) {
        super(parent);
        this._canvas = document.createElement('canvas');
        this._element.appendChild(this._canvas);
    }

    resume() {
        this._game = new Game(this._canvas, LocalGameServer, UserService.currentUser);
        super.resume();
    }

    pause(){
        this._game.destroy();
        super.pause();
    }

}

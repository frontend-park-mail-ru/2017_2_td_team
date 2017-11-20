import View from '../view/index.js';
import Game from '../../modules/gameModules/game.js';
import Events from '../../events.js';
import LocalGameServer from '../../modules/gameModules/localServer/localServer';

export default class GameView extends View {
    constructor(parent) {
        super(parent);
    }

    resume() {
        this._canvas = document.createElement('div');
        this._element.appendChild(this._canvas);
        this._game = new Game(this._canvas, LocalGameServer, [{nickname: 'nick'}]);
        this._bus.emit(Events.LOGO_OFF);
        super.resume();
    }

    pause() {
        this._game.destroy();
        this._canvas.remove();
        this._canvas = null;
        this._game = null;
        this._bus.emit(Events.LOGO_ON);
        super.pause();
    }

}

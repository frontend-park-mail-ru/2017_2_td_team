import View from '../view/index.js';
import Game from '../../modules/gameModules/game.js';
import Events from '../../events.js';
import MultiplayerStrategy from '../../modules/gameModules/strategies/multiplayerStrategy';
import template from './finishGame.pug';

export default class GameView extends View {
    constructor(parent) {
        super(parent);

    }

    resume() {
        this._element.innerHTML = '';
        this._canvas = document.createElement('div');
        this._element.appendChild(this._canvas);
        this._game = new Game(this._canvas, MultiplayerStrategy, [{nickname: 'nick'}]);
        this._bus.emit(Events.LOGO_OFF);
        this.off = this._bus.register(Events.GAME_FINISHED, (event, payload) => this.finishGame(payload));
        super.resume();
    }

    pause() {
        this.destroy();
        this._bus.emit(Events.LOGO_ON);
        super.pause();
    }

    finishGame(result) {
        this.destroy();
        this._element.innerHTML = template({context: {scores: result}});
    }

    destroy() {
        if (this._game) {
            this._game.destroy();
        }
        if (this._canvas) {
            this._canvas.remove();
        }
        this._canvas = null;
        this._game = null;
        this.off();
    }
}

import View from '../view/index.js';
import Game from '../../modules/gameModules/game.js';
import LocalGameServer from '../../modules/gameModules/localServer/localServer.js';
import Hud from '../../blocks/hud/hud.js';
import Events from '../../events.js';
import Health from '../../blocks/hud/__health/hud__health.js';
import Money from '../../blocks/hud/__money/hud__money.js';
import Damage from '../../blocks/hud/__damage/hud__damage.js';
import Speed from '../../blocks/hud/__speed/hud__speed.js';

export default class GameView extends View {
    constructor(parent) {
        super(parent);
    }

    resume() {
        this._canvas = document.createElement('div');
        this._canvas.className = 'hud__canvas';
        this._hud = new Hud(this._canvas);

        this._health = new Health(100);
        this._hud.appendBlockToBottombar(this._health);

        this._money = new Money(100);
        this._hud.appendBlockToBottombar(this._money);

        this._damage = new Damage(100);
        this._hud.appendBlockToBottombar(this._damage);

        this._speed = new Speed(100);
        this._hud.appendBlockToBottombar(this._speed);

        const tower = document.createElement('div');
        tower.style.height = '64px';
        tower.style.width = '64px';
        tower.style.backgroundSize = 'cover';
        tower.style.backgroundImage = 'url(/img/titleset.png)';
        tower.style.backgroundPositionX = '640px';
        this._hud.appendToRightSidebar(tower);
        this._hud.appendToRightSidebar(tower.cloneNode(true));
        this._hud.appendToRightSidebar(tower.cloneNode(true));
        this._hud.appendToRightSidebar(tower.cloneNode(true));

        this._hud.injectTo(this._element);

        this._game = new Game(this._canvas, LocalGameServer, [{nickname: 'anon'}]);
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

import View from '../view/index.js';
import Game from '../../modules/gameModules/game.js';
import LocalGameServer from '../../modules/gameModules/localServer/localServer.js';
import Events from '../../events.js';
import MultiplayerStrategy from '../../modules/gameModules/strategies/multiplayerStrategy';
import template from './finishGame.pug';
import LocalGameServer from '../../modules/gameModules/localServer/localServer';
import Hud from '../../blocks/hud/hud.js';
import Health from '../../blocks/hud/__health/hud__health.js';
import Money from '../../blocks/hud/__money/hud__money.js';
import Damage from '../../blocks/hud/__damage/hud__damage.js';
import Speed from '../../blocks/hud/__speed/hud__speed.js';
import Info from '../../blocks/hud/__info/hud__info.js';
import globalEventBus from '../../modules/globalEventBus.js';

export default class GameView extends View {
    constructor(parent) {
        super(parent);
    }

    resume() {
        this._element.innerHTML = '';

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

        this._info1 = new Info('monster-health', '100');
        this._hud.appendBlockToBottombar(this._info1);

        this._info2 = new Info('monster-damage', '100');
        this._hud.appendBlockToBottombar(this._info2);


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

        globalEventBus.register(Events.SHOW_MONSTER_INFO, (event, payload) => {
            this._info1.set('monster', payload.value1);
            this._info2.set('monster', payload.value2);

            this._info1.show();
            this._info2.show();
        });

        globalEventBus.register(Events.SHOW_TOWER_INFO, (event, payload) => {
            this._info1.set('tower', payload.value1);
            this._info2.set('tower', payload.value2);

            this._info1.show();
            this._info2.show();
        });

        globalEventBus.register(Events.HIDE_INFO, () => {
            this._info1.hide();
            this._info2.hide();
        });

        this._game = new Game(this._canvas, LocalGameServer, [{nickname: 'anon'}]);
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

import View from '../view/index.js';
import Game from '../../modules/gameModules/game.js';
import Events from '../../events.js';
import template from './finishGame.pug';
import LocalGameServer from '../../modules/gameModules/localServer/localServer';
import Hud from '../../blocks/hud/hud.js';
import Health from '../../blocks/hud/__health/hud__health.js';
import Money from '../../blocks/hud/__money/hud__money.js';
import Info from '../../blocks/hud/__info/hud__info.js';
import Score from '../../blocks/hud/__score/hud__score.js';

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

        this._scores = {};

        this._money = new Money(100);
        this._hud.appendBlockToBottombar(this._money);

        this._info1 = new Info('monster-health', '100');
        this._info1.hide();
        this._hud.appendBlockToBottombar(this._info1);

        this._info2 = new Info('monster-damage', '100');
        this._info2.hide();
        this._hud.appendBlockToBottombar(this._info2);

        this._hud.injectTo(this._element);

        this.subscribe(Events.PLAYER_STATE_UPDATE, (ev, payload) => {
            this._health.setHealth(payload.hp);
            this._money.setMoney(payload.money);
        });
        this.subscribe(Events.SCORES_CREATE, (ev, payload) => {
            payload.forEach(score => {
                const scoreRow = new Score(score.nickname, score.scores);
                this._scores[score.nickname] = scoreRow;
                this._hud.appendBlockToLeftSidebar(scoreRow);
            });
        });
        this.subscribe(Events.SCORES_UPDATE, (ev, payload) => {
            payload.forEach(score => this._scores[score.nickname].setScores(score.scores));
        });

        this.subscribe(Events.SHOW_MONSTER_INFO, (event, payload) => {
            this._info1.set('monster-health', payload.hp);
            this._info2.set('monster-damage', payload.damage);
            this._info1.show();
            this._info2.show();
        });

        this.subscribe(Events.SHOW_TOWER_INFO, (event, payload) => {
            this._info1.set('tower-damage', payload.damage);
            this._info2.set('tower-attack-rate', payload.aspeed);
            this._info1.show();
            this._info2.show();
        });

        this.subscribe(Events.HIDE_INFO, () => {
            this._info1.hide();
            this._info2.hide();
        });
        this.subscribe(Events.ADD_TOWER, (ev, payload) => this._hud.appendToRightSidebar(payload));

        this._game = new Game(this._canvas, LocalGameServer, [{nickname: 'anon'}]);
        this._bus.emit(Events.LOGO_OFF);
        this.subscribe(Events.GAME_FINISHED, (event, payload) => this.finishGame(payload));
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
        super.destroy();
    }

}

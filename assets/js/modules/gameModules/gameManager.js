import {globalEventBus} from '../globalEventBus.js';
import GameScene from './gameScene.js';
import {Events} from '../../events.js';

export default class GameManager {
    constructor(parent, strategy, users) {
        this.bus = globalEventBus;
        this.strategy = new strategy();
        this._registered = [];
        this.state = {};
        this.pixi = window.PIXI;
        this.ticker = this.pixi.ticker.shared;

        const unreg1 = this.bus.register(Events.NEW_GAME_STATE, (event, ctx) => {
            Object.assign(this.state, ctx);
            const loopRunner = () => this.gameLoop();
            this.scene = new GameScene(parent, 32, ctx);
            this.scene
                .prepare()
                .then(() => {
                    this.ticker.add(loopRunner);
                    this._registered.push(() => this.ticker.remove(loopRunner));
                });
        });

        const unreg2 = this.bus.register(Events.GAME_STATE_UPDATE, (event, ctx) => Object.assign(this.state, ctx));
        const unreg3 = this.bus.register(Events.GAME_FINISHED, (event, ctx) => this.onGameFinish(ctx));

        this.bus.emit(Events.NEW_GAME, users);

        this._registered.push(unreg1, unreg2, unreg3);
    }

    gameLoop() {
        this.scene.setState(this.state);
        this.scene.render();
    }

    destroy() {
        this.ticker.stop();
        if (this.scene) {
            this.scene.destroy();
        }
        this.strategy.destroy();
        this._registered.forEach(off => off());
    }

    onGameFinish() {
        this.destroy();
    }


}

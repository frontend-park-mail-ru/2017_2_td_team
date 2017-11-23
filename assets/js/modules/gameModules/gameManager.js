import globalEventBus from '../globalEventBus.js';
import GameScene from './scene/gameScene.js';
import Events from '../../events.js';
import InteractionController from './controllers/InteractionController.js';
import * as PIXI from 'pixi.js';

export default class GameManager {
    constructor(parent, strategy, users) {
        this.bus = globalEventBus;
        this.strategy = new strategy();
        this.clenupScripts = [];
        this.state = {};
        this.pixi = PIXI;
        this.ticker = this.pixi.ticker.shared;

        this.controller = new InteractionController(this.state);

        const unreg1 = this.bus.register(Events.NEW_GAME_STATE, (event, ctx) => {
            Object.assign(this.state, ctx);

            const loopRunner = () => this.gameLoop(this.ticker.elapsedMS);
            this.scene = new GameScene(parent, 32, ctx);
            this.scene
                .prepare()
                .then(() => {
                    this.ticker.add(loopRunner);
                    this.clenupScripts.push(() => this.ticker.remove(loopRunner));
                });
        });

        const unreg2 = this.bus.register(Events.GAME_STATE_UPDATE, (event, ctx) => Object.assign(this.state, ctx));

        this.bus.emit(Events.NEW_GAME, {players: users});
        this.clenupScripts.push(unreg1, unreg2);
        console.log(this.clenupScripts);
    }

    gameLoop(msDelta) {
        this.scene.setState(this.state);
        this.scene.render(msDelta);
    }

    destroy() {
        this.ticker.stop();
        this.clenupScripts.forEach(off => off());
        if (this.scene) {
            this.scene.destroy();
        }
        this.strategy.destroy();
        this.clenupScripts = [];
    }

    onGameFinish() {
        this.destroy();
    }


}

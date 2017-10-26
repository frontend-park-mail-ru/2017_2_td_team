import GameScene from './modules/gameModules/gameScene.js';
import LocalGameServer from './modules/gameModules/localServer/localServer.js';
import {globalEventBus} from './modules/globalEventBus.js';
import {Events} from './events.js';

let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas';
}

function getTitle(x, y) {
    if ((y % 96 === 0) || (y % 192 >= 96 && x === 0) || (y % 192 <= 96 && x === (31 * 32 - 32))) {
        return 0;
    }
    else {
        return 1;
    }
}

const ls = new LocalGameServer();

globalEventBus.register(Events.GAME_STATE_UPDATE, (event, payload) => {
    console.log(payload);
    const gs = new GameScene(document.body, 32, payload);

    const gl = () => {
        requestAnimationFrame(gl);
        gs.render();
    };

    gs.prepare()
        .then(gl);
});

globalEventBus.emit(Events.NEW_GAME, {
    players: [{nickname: 'nickname'}]
});




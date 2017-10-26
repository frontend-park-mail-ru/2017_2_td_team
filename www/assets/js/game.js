import Game from '../js/modules/gameModules/game.js'
import LocalGameServer from './modules/gameModules/localServer/localServer.js';

// const ls = new LocalGameServer();
//
// globalEventBus.register(Events.GAME_STATE_UPDATE, (event, payload) => {
//     console.log(payload);
//     const gs = new GameScene(document.body, 32, payload);
//
//     const gl = () => {
//
//     };
//
//     gs.prepare()
//         .then(gl);
// });
//
// globalEventBus.emit(Events.NEW_GAME, {
//     players: [{nickname: 'nickname'}]
// });
const g = new Game(document.body, LocalGameServer, {players: [{nickname:'nickname'}]});



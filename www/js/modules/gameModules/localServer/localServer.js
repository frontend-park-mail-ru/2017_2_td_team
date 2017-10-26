import {globalEventBus} from '../globalEventBus';
import {Events} from '../../events';

class LocalGameServer {
    constructor() {
        this.transport = globalEventBus;
        this._registered = [];

        this.sharedGameState = {
            players: [
                {
                    nickname: '',
                    score: 0,
                    money: 100,
                    towers: [],
                }
            ],
            map: [],
            paths: [],
            monsters: [],
            towers: [],
            hitAreas: {},
            wave: 0,
            hp: 100,
        };

        const hitArea = {
            position: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
            monsters: []
        };

        const tower = {
            coord: {x: 0, y: 0},
            range: {},
            attack: {},
            aspeed: {},
            price: 0,
        };
        const monster = {
            type: 0,
            weight: 1,
            speed: 1,
            hp: 100
        };


        this.subscribe(Events.NEW_GAME, this.onNewGame);
        this.subscribe(Events.NEW_TOWER, this.onNewTower);


    }

    subscribe(event, method) {
        const off = this.transport.register(event, method);
        this._registered.push(off);
    }

    
    gameLoop() {

    }


}

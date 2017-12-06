import Events from '../../../events.js';
import Strategy from './strategy';
import Transport from '../../transport';

export default class MultiplayerStrategy extends Strategy {
    constructor() {
        super();
        this.wsUrl = 'wss://td-java.herokuapp.com/game';
        this.transport = new Transport();
        this.playerId = null;
    }

    onNewGame() {
        this.subscribe(Events.NEW_SERVER_MESSAGE, (ev, ctx) => this.parseCtx(ctx));
        this.bus.emit(Events.SPINNER_ON);
        this.transport.connectTo(this.wsUrl, Events.NEW_SERVER_MESSAGE)
            .then(() => this.transport.send('{"class":"join"}'));
    }

    onNewTower(payload) {
        this.transport.send(`{"class":"towerOrder", "orderedTower":${payload.type}, "y":${payload.y}, "x": ${payload.x}}`);
    }

    parseCtx(ctx) {
        if (ctx.class === 'init') {
            this.bus.emit(Events.SPINNER_OFF);
            this.parseInit(ctx);
        } else if (ctx.class === 'state') {
            this.parseState(ctx);
        } else {
            this.parseFinish(ctx);
        }
    }

    parseInit(ctx) {
        const map = {
            titles: []
        };
        for (let i = 0; i < ctx.map.height; ++i) {
            map.titles.push([]);
            for (let j = 0; j < ctx.map.width; ++j) {
                map.titles[i].push(1);
            }
        }
        for (let title of ctx.map.gameMap) {
            map.titles[title.y][title.x] = title.titleType;
        }

        const currentPlayer = ctx.players.find(player => player.id === ctx.playerId);
        this.playerId = currentPlayer.id;

        this.bus.emit(Events.NEW_GAME_STATE, {
            map: map,
            hp: ctx.hp,
            players: ctx.players,
            towers: ctx.towers,
            availableTowers: ctx.availableTowers,
            wave: ctx.currentWave,
            textureAtlas: ctx.textureAtlas,
            player: currentPlayer,
            shotEvents: [],
        });
    }

    parseState(ctx) {
        const currentPlayer = ctx.players.find(player => player.id === this.playerId);
        ctx.currentWave.running = new Map(ctx.currentWave.running.map(monster => [monster.id, monster]));
        this.bus.emit(Events.GAME_STATE_UPDATE, {
            hp: ctx.hp,
            players: ctx.players,
            towers: ctx.towers,
            wave: ctx.currentWave,
            player: currentPlayer,
            shotEvents: ctx.shotEvents,
        });
    }

    parseFinish(ctx) {
        this.bus.emit(Events.GAME_FINISHED, ctx.scores);
    }

    destroy() {
        this.transport.destroy();
        super.destroy();
    }
}

import Events from '../../../events.js';
import MonsterCreator from './monsters/monsterCreator.js';
import BlueMonster from './monsters/blueMonster.js';
import RedMonster from './monsters/redMonster.js';
import OrangeMonster from './monsters/orangeMonster.js';
import Wave from './waves/wave.js';
import Strategy from '../strategies/strategy.js';
import TextureAtlas from '../scene/textureAtlas.js';
import * as PIXI from 'pixi.js';
import TowerCreator from './towers/towerCreator.js';
import RedTower from './towers/redTower.js';
import OrangeTower from './towers/orangeTower.js';
import BlueTower from './towers/blueTower.js';
import HitArea from './collisions/hitArea.js';

export default class LocalGameServer extends Strategy {
    constructor() {
        super();
        this.pixi = PIXI;

        this.genIdSource = function* () {
            let i = 0;
            while (true) {
                ++i;
                yield i;
            }
        };

        this.localGameCtx = {
            hitAreas: [],
            remaining: 0,
        };

        const monsterIdSource = this.genIdSource();
        this.monsterCreators = new Map([
            [BlueMonster.typeid, new MonsterCreator(BlueMonster, monsterIdSource)],
            [RedMonster.typeid, new MonsterCreator(RedMonster, monsterIdSource)],
            [OrangeMonster.typeid, new MonsterCreator(OrangeMonster, monsterIdSource)]
        ]);

        const towersIdSource = this.genIdSource();
        this.towerCreators = new Map([
            [BlueTower.typeid, new TowerCreator(BlueTower, towersIdSource)],
            [RedTower.typeid, new TowerCreator(RedTower, towersIdSource)],
            [OrangeTower.typeid, new TowerCreator(OrangeTower, towersIdSource)],
        ]);
    }


    onNewGame(payload) {

        this.createTickers();
        this.gamectx.map = this.generateGameMap();
        this.gamectx.towers = [];
        this.gamectx.players[0] = payload.players[0];
        this.gamectx.players[0].scores = 0;
        this.gamectx.players[0].money = 100;
        this.gamectx.hp = 100;
        this.localGameCtx.waveNumber = 0;
        this.startNewWave();
        const mapDto = {
            tiles: []
        };

        for (let i = 0; i < this.gameMap.length; ++i) {
            mapDto.tiles.push([]);
            for (let j = 0; j < this.gameMap[i].length; ++j) {
                mapDto.tiles[i].push(this.gameMap[i][j].tileType);
            }
        }

        this.bus.emit(Events.NEW_GAME_STATE, {
            map: mapDto,
            hp: this.gamectx.hp,
            players: this.gamectx.players,
            availableTowers: [101, 102, 103],
            wave: this.gamectx.wave.toDto(),
            textureAtlas: {atlas: TextureAtlas},
            player: this.gamectx.players[0],
            shotEvents: [],
        });

        this.localGameCtx.gameLoopTicker.start();
    }

    generateWave() {
        const next = ++this.localGameCtx.waveNumber;
        const monsters = Array.from(new Array(next)).map(() => {
            const monsterTypeIdx = Math.floor(Math.random() * 3 + 1001);

            const monster = this.monsterCreators.get(monsterTypeIdx).createMonster();

            monster.setPath(this.gamectx.map.paths[0]);

            return monster;
        });

        return new Wave(monsters);
    }

    generateGameMap() {
        const map = {
            tiles: [],
            paths: [],
        };
        map.tiles = [];
        for (let i = 0; i < 14; ++i) {
            map.tiles.push([]);
            for (let j = 0; j < 21; ++j) {
                map.tiles[i].push({tileType: 0, owner: null});
            }
        }

        const pathGenerator = this.generateGamePaths(1);

        map.paths.push([...pathGenerator()]);

        map.paths[0].forEach(pathPoint => {
            map.tiles[pathPoint.coord.y][pathPoint.coord.x].tileType = 1;
        });

        return map;
    }

    generateGamePaths(pathsCount) {
        return function* () {
            for (let x = 0; x < pathsCount; ++x) {
                yield* this.generatePath();
            }
        }.bind(this);
    }

    generatePath() {
        return [
            {coord: {x: 0, y: 1}, dir: {x: 1, y: 0}},
            {coord: {x: 1, y: 1}, dir: {x: 1, y: 0}},
            {coord: {x: 2, y: 1}, dir: {x: 1, y: 0}},
            {coord: {x: 3, y: 1}, dir: {x: 1, y: 0}},
            {coord: {x: 4, y: 1}, dir: {x: 1, y: 0}},
            {coord: {x: 5, y: 1}, dir: {x: 1, y: 0}},

            {coord: {x: 6, y: 1}, dir: {x: 0, y: 1}},
            {coord: {x: 6, y: 2}, dir: {x: 0, y: 1}},
            {coord: {x: 6, y: 3}, dir: {x: 0, y: 1}},
            {coord: {x: 6, y: 4}, dir: {x: 0, y: 1}},

            {coord: {x: 6, y: 5}, dir: {x: -1, y: 0}},
            {coord: {x: 5, y: 5}, dir: {x: -1, y: 0}},
            {coord: {x: 4, y: 5}, dir: {x: -1, y: 0}},
            {coord: {x: 3, y: 5}, dir: {x: -1, y: 0}},

            {coord: {x: 2, y: 5}, dir: {x: 0, y: 1}},
            {coord: {x: 2, y: 6}, dir: {x: 0, y: 1}},
            {coord: {x: 2, y: 7}, dir: {x: 0, y: 1}},

            {coord: {x: 2, y: 8}, dir: {x: 1, y: 0}},
            {coord: {x: 3, y: 8}, dir: {x: 1, y: 0}},
            {coord: {x: 4, y: 8}, dir: {x: 1, y: 0}},
            {coord: {x: 5, y: 8}, dir: {x: 1, y: 0}},
            {coord: {x: 6, y: 8}, dir: {x: 1, y: 0}},
            {coord: {x: 7, y: 8}, dir: {x: 1, y: 0}},
            {coord: {x: 8, y: 8}, dir: {x: 1, y: 0}},

            {coord: {x: 9, y: 8}, dir: {x: 0, y: -1}},
            {coord: {x: 9, y: 7}, dir: {x: 0, y: -1}},
            {coord: {x: 9, y: 6}, dir: {x: 0, y: -1}},
            {coord: {x: 9, y: 5}, dir: {x: 0, y: -1}},
            {coord: {x: 9, y: 4}, dir: {x: 0, y: -1}},
            {coord: {x: 9, y: 3}, dir: {x: 0, y: -1}},
            {coord: {x: 9, y: 2}, dir: {x: 0, y: -1}},

            {coord: {x: 9, y: 1}, dir: {x: 1, y: 0}},
            {coord: {x: 10, y: 1}, dir: {x: 1, y: 0}},
            {coord: {x: 11, y: 1}, dir: {x: 1, y: 0}},
            {coord: {x: 12, y: 1}, dir: {x: 1, y: 0}},
            {coord: {x: 13, y: 1}, dir: {x: 1, y: 0}},
            {coord: {x: 14, y: 1}, dir: {x: 1, y: 0}},
            {coord: {x: 15, y: 1}, dir: {x: 1, y: 0}},
            {coord: {x: 16, y: 1}, dir: {x: 1, y: 0}},

            {coord: {x: 17, y: 1}, dir: {x: 0, y: 1}},
            {coord: {x: 17, y: 2}, dir: {x: 0, y: 1}},
            {coord: {x: 17, y: 3}, dir: {x: 0, y: 1}},
            {coord: {x: 17, y: 4}, dir: {x: 0, y: 1}},
            {coord: {x: 17, y: 5}, dir: {x: 0, y: 1}},
            {coord: {x: 17, y: 6}, dir: {x: 0, y: 1}},
            {coord: {x: 17, y: 7}, dir: {x: 0, y: 1}},
            {coord: {x: 17, y: 8}, dir: {x: 0, y: 1}},
            {coord: {x: 17, y: 9}, dir: {x: 0, y: 1}},
            {coord: {x: 17, y: 10}, dir: {x: 0, y: 1}},
            {coord: {x: 17, y: 11}, dir: {x: 0, y: 1}},

            {coord: {x: 17, y: 12}, dir: {x: 1, y: 0}},
            {coord: {x: 18, y: 12}, dir: {x: 1, y: 0}},
            {coord: {x: 19, y: 12}, dir: {x: 1, y: 0}},
            {coord: {x: 20, y: 12}, dir: {x: 1, y: 0}},

        ];

    }

    onNewTower(payload) {

        const player = this.gamectx.players[0];

        const newTower = this.towerCreators.get(payload.type).createTower();

        if (!this.gameMap[payload.y][payload.x].owner && newTower.price <= player.money) {
            player.money -= newTower.price;
            newTower.x = payload.x;
            newTower.y = payload.y;
            newTower.owner = player;
            this.gameMap[payload.y][payload.x].owner = newTower;
            this.localGameCtx.hitAreas.push(new HitArea(newTower));
            this.gamectx.towers.push(newTower);
        }

    }

    gameLoop(ms) {
        this.reloadTowers(ms);
        this.checkHitAreas();
        this.emitShotEvents();
        this.moveMonsters(ms);
        this.checkFinishConditions();
        this.bus.emit(Events.GAME_STATE_UPDATE, {
            players: this.gamectx.players,
            hp: this.gamectx.hp,
            wave: this.gamectx.wave.toDto(),
            towers: this.gamectx.towers,
            shotEvents: this.gamectx.events,
        });
        this.updateWaveState(ms);
    }


    updateWaveState(ms) {
        const wave = this.gamectx.wave;
        if (wave.isPending) {
            wave.tryToStart(ms);
        } else if (wave.isStarted) {
            wave.pollMonsters(ms);
        } else if (wave.isFinished) {
            this.gamectx.wave = this.generateWave();
        } else {
            wave.tryToFinish();
        }
    }

    createTickers() {
        const localGameCtx = this.localGameCtx;

        localGameCtx.gameLoopTicker = new this.pixi.ticker.Ticker();
        localGameCtx.gameLoopTicker.stop();
        localGameCtx.gameLoopTicker.add(delta => {
            this.gameLoop(localGameCtx.gameLoopTicker.elapsedMS, delta);
        });

    }

    startNewWave() {
        this.gamectx.wave = this.generateWave();
    }

    moveMonsters(delta) {
        const wave = this.gamectx.wave;
        for (let monster of wave.monsters) {
            monster.updatePosition(delta);
            const end = monster.getEndPoint();
            if (monster.coord.x === end.coord.x && monster.coord.y === end.coord.y) {
                this.gamectx.hp -= monster.weight;
                wave.passMonster(monster.id);
            }
        }
    }

    checkFinishConditions() {
        if (this.gamectx.hp <= 0) {
            this.finishGame();
        }
    }

    finishGame() {
        this.localGameCtx.gameLoopTicker.stop();
        this.bus.emit(Events.GAME_FINISHED, this.gamectx.players[0].scores);

    }

    checkHitAreas() {
        this.localGameCtx.hitAreas.forEach(area => {
            area.monsters =
                Array
                    .from(this.gamectx.wave.monsters)
                    .filter(monster => area.checkCollision(monster)
                    );

        });

    }

    emitShotEvents() {
        this.gamectx.events = [];
        this.localGameCtx
            .hitAreas
            .filter(area => area.monsters.length > 0)
            .forEach(area => {
                const {fire, passed} = area.tower.fireOn(area.monsters);
                if (fire || passed) {
                    this.gamectx.events.push(...fire);
                    passed.forEach(passed => this.gamectx.wave.passMonster(passed.id));
                    this.player.money += passed.reduce((reward, monster) => monster.weight * monster.reward, 0);
                }
            });
    }

    reloadTowers(ms) {
        this.gamectx.towers.forEach(tower => tower.reload(ms));
    }

    get gameMap() {
        return this.gamectx.map.tiles;
    }

    get player() {
        return this.gamectx.players[0];
    }

    destroy() {
        this.localGameCtx.gameLoopTicker.destroy();
        super.destroy();
    }

}

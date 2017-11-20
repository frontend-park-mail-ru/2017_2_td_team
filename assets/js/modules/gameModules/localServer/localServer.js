import Events from '../../../events.js';
import MonsterCreator from './monsters/monsterCreator.js';
import BlueMonster from './monsters/blueMonster.js';
import RedMonster from './monsters/redMonster.js';
import OrangeMonster from './monsters/orangeMonster.js';
import Wave from './waves/wave.js';
import Strategy from '../strategies/strategy.js';

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
        this.createTickers();
    }


    onNewGame(payload) {
        this.gamectx.map = this.generateGameMap();
        this.gamectx.towers = [];
        this.gamectx.players[0] = payload.players[0];
        this.gamectx.players[0].score = 0;
        this.gamectx.players[0].money = 100;
        this.gamectx.hp = 100;
        this.localGameCtx.waveNumber = 0;
        this.startNewWave();
        const textureAtlas = {
            0: {
                text: '',
                texture: 'grass.png',
            },
            1: {
                text: '',
                texture: 'stone.png',
            },
            101: {
                text: 'Blue Tower',
                texture: 'bluetower.png'
            },
            102: {
                text: 'Red Tower',
                texture: 'redtower.png'
            },
            103: {
                text: 'Orange tower',
                texture: 'otower.png'
            },
            1001: {
                text: 'Red monster',
                texture: 'redMonster.png'
            },
            1002: {
                text: 'Blue monster',
                texture: 'blueMonster.png'
            },
            1003: {
                text: 'Orange monster',
                texture: 'orangeMonster.png'
            }
        };
        this.bus.emit(Events.NEW_GAME_STATE, {
            map: this.gamectx.map,
            hp: this.gamectx.hp,
            players: this.gamectx.players,
            availableTowers: [101, 102, 103],
            wave: this.gamectx.wave.toDto(),
            textureAtlas: {atlas: textureAtlas},
            player: this.gamectx.players[0],
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
            titles: [],
            paths: [],
        };
        map.titles = [];
        for (let i = 0; i < 14; ++i) {
            map.titles.push([]);
            for (let j = 0; j < 21; ++j) {
                map.titles[i].push(1);
            }
        }
        const pathGenerator = this.generateGamePaths(1);

        map.paths.push([...pathGenerator()]);

        map.paths[0].forEach(pathPoint => {
            map.titles[pathPoint.coord.y][pathPoint.coord.x] = 0;
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

        ];

    }

    onNewTower(payload) {

        const player = this.gamectx.players[0];
        const tower = player.towers[payload.number];

        if (player.money >= tower.price) {
            player.money -= tower.price;
            const newTower = this.towerCreators.get(payload.type).createTower();
            newTower.coord = payload.coord;
            this.localGameCtx.hitAreas.push(new HitArea(newTower));
            this.gamectx.towers.push(newTower);
        }
    }

    gameLoop(ms) {
        this.updateWaveState(ms);
        this.moveMonsters(ms);
        this.checkHitAreas();
        this.emitShotEvents(ms);
        this.checkFinishConditions();
        this.bus.emit(Events.GAME_STATE_UPDATE, {
            players: this.gamectx.players,
            hp: this.gamectx.hp,
            wave: this.gamectx.wave,
            towers: this.gamectx.towers,
            events: this.gamectx.events,
        });
    }


    updateWaveState(ms) {
        const wave = this.gamectx.wave;
        console.log(wave, ms);
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

        this.clenupScripts.push(() => {
            localGameCtx.gameLoopTicker.destroy();
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
        this.transport.emit(Events.GAME_FINISHED, this.gamectx.players[0]);
    }

    checkHitAreas() {
        this.localGameCtx.hitAreas.forEach(area => {
            area.monsters =
                Array
                    .from(this.gamectx.monsters.values())
                    .filter(monster => area.checkCollision(monster));
        });

    }

    emitShotEvents(ms) {
        this.gamectx.events = [];
        this.localGameCtx.hitAreas.forEach(area => {
            const {fire, passed} = area.tower.fireOn(ms, area.monsters);
            if (fire || passed) {
                this.gamectx.events.push(...fire);
                passed.forEach(passed => this.gamectx.wave.passMonster(passed.id));
                this.gamectx.players[0].money += passed.reduce((reward, monster) => monster.weight * monster.reward, 0);
            }
        });
    }


}

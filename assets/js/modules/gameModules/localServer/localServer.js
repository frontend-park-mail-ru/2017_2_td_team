import {Events} from '../../../events.js';
import MonsterCreator from './monsters/monsterCreator.js';
import BlueMonster from './monsters/blueMonster.js';
import RedMonster from './monsters/redMonster.js';
import OrangeMonster from './monsters/orangeMonster.js';
import Wave from './waves/wave.js';
import Strategy from '../strategies/strategy.js';

import * as PIXI from '../../../../../node_modules/pixi.js/dist/pixi.min';
import TowerCreator from './towers/towerCreator.js';
import RedTower from './towers/redTower.js';
import OrangeTower from './towers/orangeTower.js';
import BlueTower from './towers/blueTower.js';

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
        const monsterIdSource = this.genIdSource();
        this.monsterCreators = [
            new MonsterCreator(BlueMonster, monsterIdSource),
            new MonsterCreator(RedMonster, monsterIdSource),
            new MonsterCreator(OrangeMonster, monsterIdSource)
        ];
        const towersIdSource = this.genIdSource();
        this.towerCreators = [
            new TowerCreator(BlueTower, towersIdSource),
            new TowerCreator(RedTower, towersIdSource),
            new TowerCreator(OrangeTower, towersIdSource),
        ];
        this.createTickers();
    }


    onNewGame(payload) {

        this.gamectx.map = this.generateGameMap();

        this.gamectx.players[0] = payload.players[0];
        this.gamectx.players[0].towers = this.towerCreators.map(creator => creator.createTower());

        this.gamectx.players[0].score = 0;
        this.gamectx.players[0].money = 100;
        this.gamectx.hp = 100;
        this.startNewWave();
        this.transport.emit(Events.NEW_GAME_STATE, this.gamectx);
        this.localGameCtx.gameLoopTicker.start();
    }

    generateWave() {
        const next = ++this.gamectx.wave.number;
        const monsters = this.monsterCreators.map(creator => creator.createMonster());

        this.localGameCtx.queue = Array.from(new Array(next)).map(() => {
            const monsterTypeIdx = Math.floor(Math.random() * this.monsterCreators.length);

            return this.monsterCreators[monsterTypeIdx];
        });

        return new Wave(next, monsters);
    }

    generateGameMap() {
        const map = {
            titles: [],
            titletypes: {},
            paths: [],
        };

        for (let j = 0; j < 23; ++j) {
            map.titles.push([]);
            for (let i = 0; i < 31; ++i) {
                map.titles[j].push(1);
            }
        }
        const pathGenerator = this.generateGamePaths(1);

        map.paths.push([...pathGenerator()]);

        map.paths[0].forEach(pathPoint => {
            map.titles[pathPoint.coord.y][pathPoint.coord.x] = 0;
        });
        map.titletypes = new Map([
            [0, 'stone.png'],
            [1, 'grass.png'],
        ]);
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
        const genTitles = function* (xmax, ymax) {
            let x = 0;
            let y = 0;
            while (y < ymax) {
                const rem = y % 6;
                if (rem === 0) {
                    if (x === 30) {
                        yield {coord: {x, y}, dir: {x: 0, y: 1}};
                        ++y;
                    } else {
                        yield {coord: {x, y}, dir: {x: 1, y: 0}};
                        ++x;
                    }
                } else if (rem === 3) {
                    if (x === 0) {
                        yield {coord: {x, y}, dir: {x: 0, y: 1}};
                        ++y;
                    } else {
                        yield {coord: {x, y}, dir: {x: -1, y: 0}};
                        --x;
                    }
                } else if ((rem === 1 || rem === 2) && x === 30) {
                    yield {coord: {x, y}, dir: {x: 0, y: 1}};
                    ++y;
                } else if ((rem === 4 || rem === 5) && x === 0) {
                    yield {coord: {x, y}, dir: {x: 0, y: 1}};
                    ++y;
                }
            }
        };
        return [...genTitles(30, 22)];
    }

    onNewTower(payload) {

        const player = this.gamectx.players[0];
        const tower = player.towers[payload.number];

        if (player.money >= tower.price) {
            player.money -= tower.price;
            const newTower = this.towerCreators[payload.number].createTower();

            newTower.coord.x = payload.coord.x;
            newTower.coord.y = payload.coord.y;

            this.gamectx.towers.push(newTower);
        }
    }

    gameLoop(delta) {

        if (this.updateWaveState()) {
            this.moveMonsters(delta);
            this.checkFinishConditions();
        }

        // this.checkHitAreas();
        // this.emitShotEvents();

        this.transport.emit(Events.GAME_STATE_UPDATE, {
            monsters: this.gamectx.monsters,
            players: this.gamectx.players,
            hp: this.gamectx.hp,
            passed: this.gamectx.passed,
            towers: this.gamectx.towers,
        });
    }


    updateWaveState() {
        if (this.localGameCtx.wavePending) {
            return false;
        }
        if (this.localGameCtx.newWave) {
            this.startNewWave();
            return false;
        }
        return true;
    }

    createTickers() {
        const localGameCtx = this.localGameCtx;
        localGameCtx.waveTicker = new this.pixi.ticker.Ticker();
        localGameCtx.waveTicker.stop();
        localGameCtx.waveTicker.add(delta => {
            this.gamectx.wave.timer -= delta;
            if (this.gamectx.wave.timer <= 1) {
                localGameCtx.waveTicker.stop();
                localGameCtx.wavePending = false;
                localGameCtx.newWave = false;
                this.gamectx.wave.timer = 0;
                localGameCtx.queueTicker.start();
            }
        });

        localGameCtx.queueTicker = new this.pixi.ticker.Ticker();
        localGameCtx.queueTicker.stop();
        localGameCtx.queueTicker.speed = 0.5;
        localGameCtx.queueTicker.add(() => {

            if (localGameCtx.queue.length > 0) {

                this.updateMonstersQueue();
            } else {
                localGameCtx.queueTicker.stop();
            }

        });
        localGameCtx.gameLoopTicker = new this.pixi.ticker.Ticker();
        localGameCtx.gameLoopTicker.stop();
        localGameCtx.gameLoopTicker.add((delta) => {
            this.gameLoop(delta);
        });
        this._registered.push(() => {
            localGameCtx.gameLoopTicker.destroy();
            localGameCtx.queueTicker.destroy();
            localGameCtx.waveTicker.destroy();
        });
    }

    startNewWave() {
        this.localGameCtx.newWave = false;
        this.gamectx.wave = this.generateWave();
        this.localGameCtx.wavePending = true;
        this.localGameCtx.waveTicker.start();
    }


    updateMonstersQueue() {
        const creator = this.localGameCtx.queue.pop();
        const monster = creator.createMonster();
        monster.setPath(this.gamectx.map.paths[0]);
        ++this.localGameCtx.remaining;
        this.gamectx.monsters.set(monster.id, monster);
    }

    moveMonsters(delta) {
        const passed = [];
        for (let monster of this.gamectx.monsters.values()) {
            monster.updatePosition(delta);
            const end = monster.getEndPoint();
            if (monster.coord.x === end.coord.x && monster.coord.y === end.coord.y) {
                this.gamectx.hp -= monster.weight;
                --this.localGameCtx.remaining;
                this.gamectx.monsters.delete(monster.id);
                passed.push(monster);
            }
        }
        this.gamectx.passed = passed;
    }

    checkFinishConditions() {
        if (this.gamectx.hp === 0) {
            this.finishGame();
            return;
        }
        if (this.localGameCtx.queue.length === 0 && this.localGameCtx.remaining === 0) {
            this.localGameCtx.newWave = true;
        }
    }


    finishGame() {
        this.transport.emit(Events.GAME_FINISHED, this.gamectx.players[0]);
    }

    checkHitAreas() {
        this.localGameCtx.hitAreas.forEach(area =>
            area.monsters =
                Array
                    .from(this.localGameCtx.monsters.values())
                    .filter(monster => area.checkCollision(monster)));

    }

    emitShotEvents() {

    }
}

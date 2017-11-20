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
        this.pixi.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
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
        map.titles = [];
        for (let i = 0; i < 14; ++i) {
            map.titles.push([]);
            for (let j = 0; j < 21; ++j) {
                map.titles[i].push(1);
            }
        }
        console.log(map.titles);
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
            const newTower = this.towerCreators[payload.number].createTower();
            newTower.coord = payload.coord;
            this.localGameCtx.hitAreas.push(new HitArea(newTower));
            this.gamectx.towers.push(newTower);
        }
    }

    gameLoop(ms) {

        if (this.updateWaveState()) {
            this.moveMonsters(ms);
            this.checkHitAreas();
            this.emitShotEvents(ms);
            this.checkFinishConditions();
        }
        this.transport.emit(Events.GAME_STATE_UPDATE, {
            monsters: this.gamectx.monsters,
            players: this.gamectx.players,
            hp: this.gamectx.hp,
            passed: this.gamectx.passed,
            towers: this.gamectx.towers,
            events: this.gamectx.events,
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
            this.gameLoop(localGameCtx.gameLoopTicker.elapsedMS, delta);
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
                passed.forEach(passed => this.gamectx.monsters.delete(passed.id));
                this.gamectx.players[0].money += passed.reduce((reward, monster) => monster.weight * 10, 0);
                this.localGameCtx.remaining -= passed.length;
                this.gamectx.passed.push(...passed);
            }
        });
    }


}

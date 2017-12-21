import globalEventBus from '../../globalEventBus.js';
import Events from '../../../events.js';
import MonsterDrawer from './drawers/monsterDrawer';
import TextureProvider from './textureProvider';
import TowerDrawer from './drawers/towerDrawer';
import AnimationService from './animation/animationService';
import MapDrawer from './drawers/mapDrawer';
import MissilesEmitter from './animation/misslesEmitter';
import * as PIXI from 'pixi.js';
import TasksExecutor from './sheduler/taskExecutor';

export default class GameScene {

    constructor(parent, tilesz, gamectx) {

        this.bus = globalEventBus;
        this.map = gamectx.map.tiles;

        this.tilesz = tilesz;

        this.totaltilesW = 21;
        this.totaltilesH = 14;
        this.aspect = this.totaltilesW / this.totaltilesH;

        this.calcDimensions();

        this.pixi = PIXI;
        this.pixi.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;


        this.state = gamectx;

        this.prepared = false;
        this.renderer = new this.pixi.autoDetectRenderer(this.width, this.height);
        this.renderer.autoResize = true;

        this.resizers = [];

        this.stage = new this.pixi.Container();

        parent.appendChild(this.renderer.view);

        this.stateSetters = [];

        this.textureProvider = new TextureProvider(this);
        this.animationsService = new AnimationService(this.textureProvider, this.stage);
        this.taskExecutorService = new TasksExecutor();

        this.registerElementDrawer('mapDrawer', MapDrawer, this.stage);
        this.registerElementDrawer('monsterDrawer', MonsterDrawer, this.stage, this.animationsService);
        this.registerElementDrawer('towerDrawer', TowerDrawer, this.stage, this.animationsService);
        this.registerElementDrawer('missilesEmitter', MissilesEmitter, 'missiles', this.monsterDrawer, this.towerDrawer, this.animationsService);
        this.initEventListeners();
    }

    initEventListeners() {

        const elemResizer = this.resize.bind(this);
        window.addEventListener('resize', elemResizer);

        const repairer = this.repair.bind(this);
        window.addEventListener('visibilitychange', repairer);

        this.taskExecutorService.registerTask('destroy', () => {
            window.removeEventListener('resize', elemResizer);
            window.removeEventListener('visibilitychange', repairer);
        });
    }

    registerElementDrawer(serviceName, service, ...args) {
        this[serviceName] = new service(this, ...args);
        this.stateSetters.push(state => this[serviceName].state = state);
        this.resizers.push(params => this[serviceName].toggleResizers(params));
    }

    repair() {
        if (document.visibilityState !== 'visible') {
            return;
        }
        this.taskExecutorService.registerTask('prerender', () => {
            this.monsterDrawer.sync();
        });
    }

    resize() {
        this.calcDimensions();
        this.textureProvider.setScale(this.scalex, this.scaley);
        this.resizers.forEach(resizer => resizer({tileWidth: this.tileWidth, tileHeight: this.tileHeight}));
        this.renderer.resize(this.width, this.height);
    }

    calcDimensions() {

        let availheight = (window.innerHeight - this.tilesz) - ((window.innerHeight - this.tilesz) % this.tilesz);

        this.height = availheight;
        this.width = availheight * this.aspect;
        this.scaley = this.height / (this.totaltilesH * this.tilesz);
        this.scalex = this.width / (this.totaltilesW * this.tilesz);

        this.tileWidth = this.scalex * this.tilesz;
        this.tileHeight = this.scaley * this.tilesz;
    }

    prepare() {
        if (this.prepared) {
            return Promise.resolve(true);
        }
        return this.textureProvider.loadResources()
            .then(() => {
                this.prepared = true;
                this.setup();
                return true;
            });
    }

    setup() {
        this.mapDrawer.createGameMap();
        this.createAvailableTowers();
        this.createScores();
    }

    setState(state) {
        this.state = state;
        this.stateSetters.forEach(setter => setter(state));
    }

    createAvailableTowers() {
        this.state.availableTowers.forEach(towerid => {
            const tower = document.createElement('div');
            tower.style.height = `${this.tileHeight * 2}px`;
            tower.style.width = `${this.tileWidth * 2}px`;
            tower.style.backgroundSize = 'cover';
            tower.style.border = '4px solid #303030';
            tower.style.backgroundImage = `url(img/textures/${this.state.textureAtlas.atlas[towerid].texture})`;

            tower.addEventListener('pointerup', () => this.bus.emit(Events.TOWER_CLICKED, {
                type: towerid,
                elem: tower,
            }));
            this.bus.emit(Events.ADD_TOWER, tower);
        });
    }


    render(ms) {
        this.taskExecutorService.trigger('prerender');
        this.updateWaveTimer();
        this.towerDrawer.updateTowerSprites();
        this.monsterDrawer.updateMonsterSprites();

        this.missilesEmitter.emitMissiles();
        this.animationsService.updateAnimations(ms);

        this.monsterDrawer.processPassedMonsters();
        this.monsterDrawer.processGraveyard();
        this.updateHudIndicators();
        this.renderer.render(this.stage);

    }

    destroy() {
        this.pixi.loader.reset();
        this.pixi.utils.clearTextureCache();
        this.clenupScripts.forEach(off => off());
        this.taskExecutorService.trigger('destroy');
        this.stage.destroy();
        this.renderer.view.remove();
    }

    updateHudIndicators() {
        this.bus.emit(Events.PLAYER_STATE_UPDATE, {hp: this.state.hp, money: this.state.player.money});
        this.updateScores();
    }

    createScores() {
        const scores = this.state.players.map(player => {
            return {
                nickname: player.nickname,
                scores: player.scores
            };
        });
        this.bus.emit(Events.SCORES_CREATE, scores);
    }

    updateScores() {
        const scores = this.state.players.map(player => {
            return {
                nickname: player.nickname,
                scores: player.scores
            };
        });
        this.bus.emit(Events.SCORES_UPDATE, scores);
    }

    updateWaveTimer() {
        const msToStart = this.state.wave.msToStart;
        if (msToStart > 0) {
            this.bus.emit(Events.TIMER_UPDATE, (msToStart / 1000).toFixed(1));
            return;
        }
        if (!msToStart) {
            this.bus.emit(Events.TIMER_UPDATE, 0);
        }
    }
}

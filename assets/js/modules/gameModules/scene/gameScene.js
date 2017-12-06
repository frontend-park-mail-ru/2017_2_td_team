import globalEventBus from '../../globalEventBus.js';
import Events from '../../../events.js';
import MonsterDrawer from './drawers/monsterDrawer';
import TextureProvider from './textureProvider';
import TowerDrawer from './drawers/towerDrawer';
import AnimationService from './animation/animationService';
import MapDrawer from './drawers/mapDrawer';
import MissilesEmitter from './animation/misslesEmitter';

export default class GameScene {

    constructor(parent, titlesz, gamectx) {

        this.bus = globalEventBus;
        this.map = gamectx.map.titles;

        this.titlesz = titlesz;

        this.totalTitlesW = 21;
        this.totalTitlesH = 14;
        this.aspect = this.totalTitlesW / this.totalTitlesH;

        this.calcDimensions();

        this.pixi = window.PIXI;
        this.pixi.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        const elemResizer = this.resize.bind(this);
        window.addEventListener('resize', elemResizer);

        this.clenupScripts = [() => window.removeEventListener('resize', elemResizer)];
        this.state = gamectx;

        this.prepared = false;
        this.renderer = new this.pixi.autoDetectRenderer(this.width, this.height);
        this.renderer.autoResize = true;

        this.resizers = [];

        this.stage = new this.pixi.Container();

        parent.appendChild(this.renderer.view);

        this.parent = parent;
        this.stateSetters = [];

        this.textureProvider = new TextureProvider(this);
        this.animationsService = new AnimationService(this.textureProvider, this.stage);
        this.registerElementDrawer('mapDrawer', MapDrawer, this.stage);
        this.registerElementDrawer('monsterDrawer', MonsterDrawer, this.stage, this.animationsService);
        this.registerElementDrawer('towerDrawer', TowerDrawer, this.stage, this.animationsService);
        this.registerElementDrawer('missilesEmitter', MissilesEmitter, 'missiles', this.monsterDrawer, this.towerDrawer, this.animationsService);

    }

    registerElementDrawer(serviceName, service, ...args) {
        this[serviceName] = new service(this, ...args);
        this.stateSetters.push(state => this[serviceName].state = state);
        this.resizers.push(params => this[serviceName].toggleResizers(params));
    }

    resize() {
        this.calcDimensions();
        this.textureProvider.setScale(this.scalex, this.scaley);
        this.resizers.forEach(resizer => resizer({titleWidth: this.titleWidth, titleHeight: this.titleHeight}));
        this.renderer.resize(this.width, this.height);
    }

    calcDimensions() {

        let availheight = (window.innerHeight - this.titlesz) - ((window.innerHeight - this.titlesz) % this.titlesz);

        this.height = availheight;
        this.width = availheight * this.aspect;
        this.scaley = this.height / (this.totalTitlesH * this.titlesz);
        this.scalex = this.width / (this.totalTitlesW * this.titlesz);

        this.titleWidth = this.scalex * this.titlesz;
        this.titleHeight = this.scaley * this.titlesz;
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
            tower.style.height = `${this.titleHeight * 2}px`;
            tower.style.width = `${this.titleWidth * 2}px`;
            tower.style.backgroundSize = 'cover';
            tower.style.backgroundImage = `url(img/textures/${this.state.textureAtlas.atlas[towerid].texture})`;
            tower.addEventListener('pointerup', () => this.bus.emit(Events.TOWER_CLICKED, {
                type: towerid,
                elem: tower,
            }));
            this.bus.emit(Events.ADD_TOWER, tower);
        });
    }


    render(ms) {
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
            this.bus.emit(Events.TIMER_UPDATE, ( msToStart / 1000).toFixed(1));
            return;
        }
        if (!msToStart) {
            this.bus.emit(Events.TIMER_UPDATE, 0);
        }
    }
}

import globalEventBus from '../../../globalEventBus';
import * as PIXI from 'pixi.js';

export default class ElementDrawer {

    constructor(gameScene, animationService) {

        this.pixi = PIXI;
        this.stage = gameScene.stage;
        this.state = gameScene.state;
        this.animationService = animationService;
        this.resizers = new Map();
        this.clenupScripts = [];
        this.bus = globalEventBus;
        this.textureProvider = gameScene.textureProvider;
        this.tileParams = {tileWidth: gameScene.tileWidth, tileHeight: gameScene.tileHeight};
        this.pane = null;
    }

    get tileWidth() {
        return this.tileParams.tileWidth;
    }

    get tileHeight() {
        return this.tileParams.tileHeight;
    }

    toggleResizers(params) {
        this.tileParams = params;
        this.resize();
        this.resizers.forEach(resizer => resizer());
    }

    destroy() {
        this.cleanup();
        this.clenupScripts.forEach(cleanup => cleanup());
        this.clenupScripts.clear();
        this.resizers.clear();
    }

    registerResizer(elem, callback) {
        this.resizers.set(elem, callback);
    }

    resize() {

    }

    cleanup() {

    }

    set pane(pane){
        this._pane = pane;
    }

    get pane(){
        return this._pane;
    }


}

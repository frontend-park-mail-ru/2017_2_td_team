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
        this.titleParams = {titleWidth: gameScene.titleWidth, titleHeight: gameScene.titleHeight};
        this.pane = null;
    }

    get titleWidth() {
        return this.titleParams.titleWidth;
    }

    get titleHeight() {
        return this.titleParams.titleHeight;
    }

    toggleResizers(params) {
        this.titleParams = params;
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

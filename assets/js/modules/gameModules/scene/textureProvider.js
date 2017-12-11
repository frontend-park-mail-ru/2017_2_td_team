import * as PIXI from 'pixi.js';


export default class TextureProvider {

    constructor(gameScene) {
        this.pixi = PIXI;
        this.scale = {scalex: gameScene.scalex, scaley: gameScene.scaley};
        this.textureAtlas = gameScene.state.textureAtlas;
    }

    setScale(scalex, scaley) {
        this.scale.scalex = scalex;
        this.scale.scaley = scaley;
    }

    get textures() {
        return this.pixi.loader.resources[TEXTURE_PATH].textures;
    }


    get loader() {
        return this.pixi.loader;
    }

    loadResources() {
        return new Promise((resolve) => {
            this.loader.reset();
            this.loader
                .add(TEXTURE_PATH)
                .load(() => resolve(true));
        });
    }

    getTextureForType(typeid) {
        return this.textures[this.textureAtlas.atlas[typeid].texture];
    }

    getTexturesSetForType(typeid) {
        return this.textureAtlas.atlas[typeid].texturesPacks
            .map(textureSet => textureSet
                .map(path => this.textures[path]));
    }

    getSpriteByTexture(typeid) {
        return new this.pixi.Sprite(this.getTextureForType(typeid));
    }

    getScaledSprite(typeid) {
        return this.scaleElements(this.getSpriteByTexture(typeid));
    }

    scaleElements(...elems) {
        for (let elem of elems) {
            elem.scale.set(this.scale.scalex, this.scale.scaley);
        }
        return elems[0];
    }

}

const TEXTURE_PATH = 'img/titleset.json';

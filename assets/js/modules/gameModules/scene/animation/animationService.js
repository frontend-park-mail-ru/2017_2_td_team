import FxAtlas from '../fxAtlas.js';
import * as PIXI from 'pixi.js';

export default class AnimationService {
    constructor(textureProvider, parent) {
        this.FxAtlas = FxAtlas;
        this.animations = new Map();
        this.textureProvider = textureProvider;
        this.pixi = PIXI;
        this.layers = new Map();
        this.stage = parent;
    }

    updateAnimations(ms) {
        this.animations.forEach(animSet => {
            for (let animation of animSet.values()) {
                if (!animation.update(ms)) {
                    animSet.delete(animation);
                    animation.destroy();
                }
            }
        });
        this.animations.forEach((animSet, targetId, map) => {
            if (!animSet.size) {
                map.delete(targetId);
            }
        });
    }

    runAnimation(id, animationSprite) {
        const animations = this.animations.get(id);
        if (!animations) {
            this.animations.set(id, new Set([animationSprite]));
        } else {
            animations.add(animationSprite);
        }
        animationSprite.start();
    }

    createAnimatedSprite(layer, typeid) {
        const frames = this.FxAtlas.get(typeid).map(path => this.pixi.Texture.fromFrame(path));
        const animation = new this.pixi.extras.AnimatedSprite(frames);
        animation.anchor.set(0.5, 0.5);

        this.textureProvider.scaleElements(animation);

        this.getAnimationLayer(layer)
            .addChild(animation);
        return animation;
    }

    createAnimationSpritesContainer(layer, typeid) {

        const animations = this.textureProvider.getTexturesSetForType(typeid)
            .map(frames => this.textureProvider
                .scaleElements(new this.pixi.extras.AnimatedSprite(frames)));

        const layerContainer = this.getAnimationLayer(layer);
        const animContainer = new this.pixi.Container();
        animContainer.addChild(...animations);
        layerContainer.addChild(animContainer);
        return animContainer;
    }

    getAnimationLayer(layer) {
        let animContainer = this.layers.get(layer);
        if (!animContainer) {
            animContainer = new this.pixi.Container();
            this.layers.set(layer, animContainer);
            this.stage.addChild(animContainer);
        }
        return animContainer;
    }


    hasAnimation(id) {
        return this.animations.has(id);
    }


}

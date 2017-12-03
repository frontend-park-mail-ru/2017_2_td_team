import AnimationsAtlas from './../animationsAtlas.js';
import * as PIXI from 'pixi.js';

export default class AnimationService {
    constructor(textureProvider, parent) {
        this.animationsAtlas = AnimationsAtlas;
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

    createAnimatedSprite(layer, typeid, scalex = 1, scaley = 1) {
        const frames = [];
        for (let frame of this.animationsAtlas.get(typeid)) {
            frames.push(this.pixi.Texture.fromFrame(frame));
        }
        const animation = new this.pixi.extras.AnimatedSprite(frames);
        animation.anchor.set(0.5, 0.5);

        this.textureProvider.scaleElements(animation);
        animation.scale.set(animation.scale.x * scalex, animation.scale.y * scaley);

        let animContainer = this.layers.get(layer);
        if (!animContainer) {
            animContainer = new this.pixi.Container();
            this.layers.set(layer, animContainer);
            this.stage.addChild(animContainer);
        }
        animContainer.addChild(animation);
        return animation;
    }

    hasAnimation(id) {
        return this.animations.has(id);
    }


}

import globalEventBus from '../../globalEventBus.js';
import Events from '../../../events.js';
import AnimationsAtlas from './animationsAtlas.js';
import Missle from './missle.js';

export default class GameScene {

    constructor(parent, titlesz, gamectx) {
        this.bus = globalEventBus;
        this.map = gamectx.map.titles;

        this.titlesz = titlesz;

        this.totalTitlesW = 21;
        this.totalTitlesH = 14;
        this.aspect = this.totalTitlesW / this.totalTitlesH;

        this.animationsAtlas = AnimationsAtlas;
        this.animations = new Map([]);
        this.calcDimensions();

        this.pixi = window.PIXI;

        const elemResizer = this.resize.bind(this);
        window.addEventListener('resize', elemResizer);

        this.clenupScripts = [() => window.removeEventListener('resize', elemResizer)];
        this.setState(gamectx);

        this.prepared = false;
        this.renderer = new this.pixi.autoDetectRenderer(this.width, this.height);
        this.renderer.autoResize = true;

        this.sprites = {};
        this.resizers = [];
        this.graveyard = new Set();

        this.stage = new this.pixi.Container();

        parent.appendChild(this.renderer.view);

        this.parent = parent;
    }

    scaleElements(...elems) {
        for (let elem of elems) {
            elem.scale.set(this.scalex, this.scaley);
        }
        return elems[0];
    }

    resize() {
        this.calcDimensions();
        this.resizers.forEach(resizer => resizer());
        this.renderer.resize(this.width, this.height);


    }

    calcDimensions() {
        let availheight = window.innerHeight - window.innerHeight % this.titlesz;

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
        return new Promise((resolve) => {
            this.pixi.loader.reset();
            this.pixi.loader
                .add('img/titleset.json')
                .load(() => {
                    this.prepared = true;
                    this.textures = this.pixi.loader.resources['img/titleset.json'].textures;
                    this.setup();
                    resolve(true);
                });
        });
    }

    setup() {
        this.stage.addChild(this.createGameMap());
        this.createAvailableTowers();
        this.animationsContainer = new this.pixi.Container();
        this.stage.addChild(this.animationsContainer);
        this.createScores();
    }

    setState(state) {
        this.state = state;
    }

    getTextureForType(typeid) {
        return this.textures[this.state.textureAtlas.atlas[typeid].texture];
    }

    getSpriteByTexture(typeid) {
        return new this.pixi.Sprite(this.getTextureForType(typeid));
    }

    getScaledSprite(typeid) {
        return this.scaleElements(this.getSpriteByTexture(typeid));
    }


    createGameMap() {
        this.titlesContainer = new this.pixi.Container();
        this.titlesSprites = [];

        for (let j = 0; j < this.map.length; ++j) {
            this.titlesSprites.push([]);
            for (let i = 0; i < this.map[j].length; ++i) {

                const titleType = this.map[j][i];
                const title = this.getSpriteByTexture(titleType);
                const titlePlacer = () => {
                    title.width = this.titleWidth;
                    title.height = this.titleHeight;
                    title.position.set(i * this.titleWidth, j * this.titleHeight);
                };
                titlePlacer();
                this.resizers.push(titlePlacer);

                title.interactive = true;

                title.on('pointerover', () => {
                    title.alpha = 0.7;
                });

                title.on('pointerout', () => {
                    title.alpha = 1;
                });

                title.on('pointertap', () => {
                    this.bus.emit(Events.TITLE_CLICKED, {coord: {x: i, y: j}, titleType});
                });

                this.titlesSprites[j].push(title);
                this.titlesContainer.addChild(title);
            }
        }

        return this.titlesContainer;
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

    createSelectedTowerBar() {
        const selected = new this.pixi.Container();
        const ap = this.scaleElements(new this.pixi.Sprite(this.textures['damage.png']));

        const as = this.scaleElements(new this.pixi.Sprite(this.textures['aspeed.png']));
        selected.addChild(ap, as);

        const resizer = () => {
            const offsetx = this.sprites.money.width + this.titleWidth + this.sprites.money.getGlobalPosition().x;

            ap.position.set(0, 0);
            as.position.set(ap.width * 2, 0);
            this.scaleElements(ap, as);
            selected.position.set(offsetx, this.height - this.titleHeight);

        };
        resizer();
        this.resizers.push(resizer);
        return selected;
    }

    render(ms) {

        this.updateMonstersSprites();
        this.updateAnimations(ms);
        this.updateTowersSprites();
        this.updateHudIndicators();
        this.renderer.render(this.stage);
    }

    updateMonstersSprites() {
        if (!this.monstersSprites) {
            this.monstersSprites = new Map();
            this.monstersContainer = new this.pixi.Container();
            this.stage.addChild(this.monstersContainer);
        }
        const monsters = this.state.wave.running;
        for (let monster of monsters) {
            if (!this.monstersSprites.has(monster.id)) {
                const monsterSprite = this.getScaledSprite(monster.typeid);

                this.resizers.push(() => {
                    monsterSprite.width = this.titleWidth;
                    monsterSprite.height = this.titleHeight;
                });

                monsterSprite
                    .position
                    .set(this.titleWidth * monster.titleCoord.x,
                        this.titleHeight * monster.titleCoord.y);
                monsterSprite.interactive = true;
                monsterSprite.on('pointertap', () => {
                    this.bus.emit(Events.SHOW_MONSTER_INFO, {hp: monster.hp, damage: monster.weight});
                });

                this.monstersContainer.addChild(monsterSprite);
                this.monstersSprites.set(monster.id, monsterSprite);


            } else {
                const monsterSprite = this.monstersSprites.get(monster.id);
                monsterSprite.x = (monster.titleCoord.x + monster.relativeCoord.x) * this.titleWidth;
                monsterSprite.y = (monster.titleCoord.y + monster.relativeCoord.y) * this.titleHeight;
            }
        }
        this.monstersContainer.children.sort(function (a, b) {
            if (a.position.y > b.position.y) {
                return 1;
            }
            if (a.position.y < b.position.y) {
                return -1;
            }
            if (a.position.x > b.position.x) {
                return 1;
            }
            if (a.position.x < b.position.x) {
                return -1;
            }
            return 0;
        });


        for (let event of this.state.shotEvents) {

            const monsterSprite = this.monstersSprites.get(event.monsterId);
            const towerMeta = this.getTowerMeta(event.towerId);
            const animation = this.createShootAnimationSprite(towerMeta.typeid);
            animation.scale.set(this.scalex * 2, this.scaley * 2);
            this.animationsContainer.addChild(animation);
            const missle = new Missle(animation, towerMeta.sprite, monsterSprite, event.offset, 250);

            this.runShootAnimation(event.monsterId, missle);

        }

        for (let passedMonster of this.state.wave.passed) {
            const monsterSprite = this.monstersSprites.get(passedMonster.id);
            if (monsterSprite) {
                const inUse = this.animations.has(passedMonster.id);
                if (!inUse) {
                    this.monstersSprites.delete(passedMonster.id);
                    this.monstersContainer.removeChild(monsterSprite);
                } else {
                    this.graveyard.add(passedMonster.id);
                }
            }
        }
        this.graveyard.forEach(id => {
            const inUse = this.animations.has(id);
            if (!inUse) {
                this.monstersContainer.removeChild(this.monstersSprites.get(id));
                this.monstersSprites.delete(id);
                this.graveyard.delete(id);
            }
        });
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

    updateTowersSprites() {
        if (!this.towersContainer) {
            this.towersContainer = new this.pixi.Container();
            this.towersSprites = new Map();
            this.titlesContainer.addChild(this.towersContainer);
        }

        for (let tower of this.state.towers) {
            if (!this.towersSprites.has(tower.id)) {

                const towerSprite = this.getScaledSprite(tower.typeid);

                const resizer = () => {
                    towerSprite.position.set(tower.titlePosition.x * this.titleWidth, tower.titlePosition.y * this.titleHeight);
                    this.scaleElements(towerSprite);
                };
                resizer();
                this.resizers.push(resizer);
                towerSprite.interactive = true;
                towerSprite.on('pointertap', () => {
                    this.bus.emit(Events.SHOW_TOWER_INFO, {
                        damage: tower.damage,
                        aspeed: (1000 / tower.period).toFixed(2)
                    });
                });
                this.titlesContainer.addChild(towerSprite);
                this.towersSprites.set(tower.id, {sprite: towerSprite, typeid: tower.typeid});

            }
        }
    }


    get monstersSprites() {
        return this.sprites.monsters;
    }

    get towersSprites() {
        return this.sprites.towers;
    }

    set towersSprites(towers) {
        this.sprites.towers = towers;
    }

    get towersContainer() {
        return this.sprites.towersContainer;
    }

    get monstersContainer() {
        return this.sprites.monstersContrainer;
    }

    get titlesContainer() {
        return this.sprites.titles;
    }

    set titlesContainer(cont) {
        this.sprites.titles = cont;
    }

    get titlesSprites() {
        return this.sprites.titleSprites;
    }

    set titlesSprites(sprites) {
        this.sprites.titleSprites = sprites;
    }

    get animationsContainer() {
        return this.sprites.animationsContainer;
    }

    set animationsContainer(cont) {
        this.sprites.animationsContainer = cont;
    }


    set towersContainer(towers) {
        this.sprites.towersContainer = towers;
    }

    set monstersContainer(cont) {
        this.sprites.monstersContrainer = cont;
    }

    set monstersSprites(sprites) {
        this.sprites.monsters = sprites;
    }

    createShootAnimationSprite(typeid) {
        const frames = [];
        for (let frame of this.animationsAtlas.get(typeid)) {
            frames.push(this.pixi.Texture.fromFrame(frame));
        }
        const animation = new this.pixi.extras.AnimatedSprite(frames);
        animation.anchor.set(0.5, 0.5);
        this.sprites.animationsContainer.addChild(animation);
        return animation;
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

    runShootAnimation(id, animationSprite) {
        const animations = this.animations.get(id);
        if (!animations) {
            this.animations.set(id, new Set([animationSprite]));
        } else {
            animations.add(animationSprite);
        }
        animationSprite.start();
    }

    getTowerMeta(towerId) {
        return this.towersSprites.get(towerId);
    }


}

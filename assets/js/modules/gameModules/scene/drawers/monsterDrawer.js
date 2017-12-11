import ElementDrawer from './elemDrawer.js';
import Events from '../../../../events.js';
import MonsterSprite from '../animation/monster.js';

export default class MonsterDrawer extends ElementDrawer {

    constructor(gameScene, parent, animationService) {
        super(gameScene, animationService);
        this.pane = new this.pixi.Container();
        this.monstersSprites = new Map();
        this.graveyard = new Set();
        parent.addChild(this.pane);
    }

    getMonsterSprite(id) {
        return this.monstersSprites.get(id);
    }


    updateMonsterSprites() {
        const monsters = this.state.wave.running;
        for (let [id, monster] of monsters) {
            const monsterSprite = this.monstersSprites.get(id);
            if (!monsterSprite) {
                this.registerMonsterSprite(monster);
            } else {
                monsterSprite.meta = monster;
                this.moveMonster(monster);
            }
        }
        this.rearrangeMonsterSprites();

    }

    registerMonsterSprite(monster) {
        const monsterSpritesContainer = this
            .animationService
            .createAnimationSpritesContainer('monsters', monster.typeid);


        monsterSpritesContainer.x = (monster.titleCoord.x + monster.relativeCoord.x) * this.titleWidth;
        monsterSpritesContainer.y = (monster.titleCoord.y + monster.relativeCoord.y) * this.titleHeight;


        monsterSpritesContainer.interactive = true;
        monsterSpritesContainer.on('pointertap', () => {
            this.bus.emit(Events.SHOW_MONSTER_INFO, {hp: monster.hp, damage: monster.weight});
        });

        this.registerResizer(monsterSpritesContainer, () => {
            monsterSpritesContainer.width = this.titleWidth;
            monsterSpritesContainer.height = this.titleHeight;
        });
        const monsterSprite = new MonsterSprite(monsterSpritesContainer, monster);
        this.animationService.runAnimation(monster.id, monsterSprite);
        this.monstersSprites.set(monster.id, monsterSprite);

    }

    moveMonster(monster) {
        const monsterSprite = this.monstersSprites.get(monster.id);
        const rawSprite = monsterSprite.getSpritesContainer();
        const titleParams = this.titleParams;
        rawSprite.x = (monster.titleCoord.x + monster.relativeCoord.x) * titleParams.titleWidth;
        rawSprite.y = (monster.titleCoord.y + monster.relativeCoord.y) * titleParams.titleHeight;
        monsterSprite.rotate();
    }

    rearrangeMonsterSprites() {
        this.pane.children.sort(function (a, b) {
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
    }

    processPassedMonsters() {
        for (let passedMonster of this.state.wave.passed) {
            const monsterSprite = this.monstersSprites.get(passedMonster.id);
            if (monsterSprite && !this.graveyard.has(passedMonster.id)) {
                monsterSprite.meta = passedMonster;
                monsterSprite.running = false;
                this.graveyard.add(passedMonster.id);
            }
        }
    }

    processGraveyard() {
        this.graveyard.forEach(id => {
            const inUse = this.animationService.hasAnimation(id);
            if (!inUse) {
                const sprite = this.monstersSprites.get(id).getSpritesContainer();
                this.pane.removeChild(sprite);
                this.monstersSprites.delete(id);
                this.resizers.delete(sprite);
                this.graveyard.delete(id);
                sprite.destroy();
            }
        });
    }

}

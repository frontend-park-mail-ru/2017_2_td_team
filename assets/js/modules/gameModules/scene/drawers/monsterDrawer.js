import ElementDrawer from './elemDrawer';
import Events from '../../../../events';

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
        for (let monster of monsters) {
            if (!this.monstersSprites.has(monster.id)) {
                this.registerMonsterSprite(monster);
            } else {
                this.moveMonster(monster);
            }
        }
        this.rearrangeMonsterSprites();
    }

    registerMonsterSprite(monster) {

        const monsterSprite = this.textureProvider.getScaledSprite(monster.typeid);
        this.registerResizer(monsterSprite, () => {
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
        this.pane.addChild(monsterSprite);
        this.monstersSprites.set(monster.id, monsterSprite);
    }

    moveMonster(monster) {
        const monsterSprite = this.monstersSprites.get(monster.id);
        const titleParams = this.titleParams;
        monsterSprite.x = (monster.titleCoord.x + monster.relativeCoord.x) * titleParams.titleWidth;
        monsterSprite.y = (monster.titleCoord.y + monster.relativeCoord.y) * titleParams.titleHeight;
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
            if (monsterSprite) {
                const binded = this.animationService.hasAnimation(passedMonster.id);
                if (!binded) {
                    this.monstersSprites.delete(passedMonster.id);
                    this.pane.removeChild(monsterSprite);
                } else {
                    this.graveyard.add(passedMonster.id);
                }
            }
        }
    }

    processGraveyard() {
        this.graveyard.forEach(id => {
            const inUse = this.animationService.hasAnimation(id);
            if (!inUse) {
                this.pane.removeChild(this.monstersSprites.get(id));
                this.monstersSprites.delete(id);
                this.graveyard.delete(id);
            }
        });
    }

}

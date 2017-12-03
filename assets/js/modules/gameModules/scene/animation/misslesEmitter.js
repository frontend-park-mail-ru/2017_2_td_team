import Missile from './missile.js';
import ElementDrawer from '../drawers/elemDrawer.js';

export default class MissilesEmitter extends ElementDrawer {
    constructor(gameScene, layer, monstersDrawer, towerDrawer, animationService) {
        super(gameScene, animationService);
        this.state = gameScene.state;
        this.monsterDrawer = monstersDrawer;
        this.towerDrawer = towerDrawer;
        this.animationService = animationService;
        this.layer = layer;

    }

    emitMissiles() {
        const shotEvents = this.state.shotEvents;
        shotEvents.forEach(event => {
            const monsterSprite = this.monsterDrawer.getMonsterSprite(event.monsterId);
            const towerMeta = this.towerDrawer.getTower(event.towerId);
            const animation = this.animationService.createAnimatedSprite(this.layer, towerMeta.typeid, 2, 2);

            const missile = new Missile(animation, towerMeta.sprite, monsterSprite, event.offset, 250);
            this.animationService.runAnimation(event.monsterId, missile);
        });
    }

}

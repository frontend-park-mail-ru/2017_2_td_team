import {globalEventBus} from '../../globalEventBus.js';

class TowerManager {
    constructor(root, map) {
        this.bus = globalEventBus;
        this.rooot = root;
        this.map = map;
        this.bus.register(Events.TOWER_CLICKED, (event, payload) => this.onTowerClicked(tower));
        this.clicked = null;
        PIXI.InteractionManager.on('click', () => {
            if(this.clicked){
                this.tryToAddTower();
            }
        })
    }

    onTowerClicked(tower) {
        if (this.clicked === tower) {
            this.clicked = null;
            tower.tint = 0xFFFFFF;
            return;
        }
        tower.tint = 0xAAAAAA;
        this.clicked.add(tower.type);
    }


    tryToAddTower() {
        const pos = PIXI.InteractionManager
        PIXI.InteractionManager.hitTest(this.root, )
    }
}

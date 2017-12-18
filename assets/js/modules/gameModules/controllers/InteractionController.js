import globalEventBus from '../../globalEventBus';
import Events from '../../../events';

export default class InteractionController {
    constructor(gamectx) {
        this.gamectx = gamectx;
        this.towerInteraction = {
            clicked: null,
            type: 0,
        };
        this.bus = globalEventBus;
        this.bus.register(Events.TOWER_CLICKED, (event, tower) => this.onTowerClicked(tower));
        this.bus.register(Events.TILE_CLICKED, (event, tile) => this.onTileClicked(tile));

    }


    onTowerClicked(tower) {

        const clicked = this.towerInteraction.clicked;

        if (clicked && clicked.elem !== tower.elem) {
            clicked.elem.style.border = '0px solid green';
            this.towerInteraction.clicked = tower;
            tower.elem.style.border = '4px solid green';
            return;
        }

        if (clicked === null) {
            this.towerInteraction.clicked = tower;
            tower.elem.style.border = '4px solid green';
            return;
        }
        clicked.elem.style.border = '0px solid green';
        this.towerInteraction.clicked = null;

    }

    onTileClicked(payload) {
        const clicked = this.towerInteraction.clicked;
        if (payload.tileType === 1) {
            return;
        }
        if (clicked) {
            this.bus.emit(Events.NEW_TOWER, {
                x: payload.coord.x,
                y: payload.coord.y,
                type: clicked.type,
            });
            this.clicked = null;
        }
    }
}

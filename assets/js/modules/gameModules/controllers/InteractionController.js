import {globalEventBus} from '../../globalEventBus';
import {Events} from '../../../events';

export default class InteractionController {
    constructor(gamectx) {
        this.gamectx = gamectx;
        this.towerInteraction = {
            clicked: null,
            type: '',
        };
        this.bus = globalEventBus;
        this.bus.register(Events.TOWER_CLICKED, (event, tower) => this.onTowerClicked(tower));
        this.bus.register(Events.TITLE_CLICKED, (event, title) => this.onTitleClicked(title));

    }


    onTowerClicked(tower) {

        const clicked = this.towerInteraction.clicked;
        if (clicked && clicked !== tower) {
            clicked.sprite.tint = 0xFFFFFF;
            this.towerInteraction.clicked = tower;
            tower.sprite.tint = 0x006400;
            return;
        }
        if (clicked === null) {
            this.towerInteraction.clicked = tower;
            tower.sprite.tint = 0x006400;
            return;
        }
        this.towerInteraction.clicked = null;
        tower.sprite.tint = 0xFFFFFF;

    }

    onTitleClicked(payload) {
        const clicked = this.towerInteraction.clicked;
        if (payload.titleType === 0) {
            return;
        }
        if (clicked) {
            this.bus.emit(Events.NEW_TOWER, {
                coord: {x: payload.title.x, y: payload.title.y},
                number: clicked.number,
            });
            this.clicked = 0;
        }
    }
}

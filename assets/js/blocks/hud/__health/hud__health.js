import './hud__health.styl';
import Block from '../../block/block.js';

export default class Health extends Block {
    constructor(health) {
        super(document.createElement('div'));
        this._element.className = 'hud__health';

        this._icon = document.createElement('div');
        this._icon.className = 'hud__health__icon';

        this._text = document.createElement('div');
        this._text.className = 'hud__health__text';
        this.setHealth(health);

        this._element.appendChild(this._icon);
        this._element.appendChild(this._text);
    }

    setHealth(health) {
        this._text.innerHTML = `${health}HP`;
    }
}

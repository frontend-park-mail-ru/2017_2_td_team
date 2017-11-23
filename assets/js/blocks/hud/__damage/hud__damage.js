import './hud__damage.styl';
import Block from '../../block/block.js';

export default class Damage extends Block {
    constructor(damage) {
        super(document.createElement('div'));
        this._element.className = 'hud__damage';

        this._icon = document.createElement('div');
        this._icon.className = 'hud__damage__icon';

        this._text = document.createElement('div');
        this._text.className = 'hud__damage__text';
        this.setDamage(damage);

        this._element.appendChild(this._icon);
        this._element.appendChild(this._text);
    }

    setDamage(damage) {
        this._text.innerHTML = `${damage}`;
    }
}

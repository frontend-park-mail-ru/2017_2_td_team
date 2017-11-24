import './hud__info.styl';
import Block from '../../block/block.js';

export default class Info extends Block {
    constructor(name, text) {
        super(document.createElement('div'));
        this._element.className = 'hud__info';

        this._icon = document.createElement('div');
        this._text = document.createElement('p');
        this._text.textContent = text;

        this._name = name;
        this._icon.className = `hud__info__icon hud__info__icon_${this._name}`;
        this._text.className = `hud__info__text hud__info__text_${this._name}`;

        this._element.appendChild(this._icon);
        this._element.appendChild(this._text);
    }

    set(name, text) {
        this._name = name;
        this._icon.className = `hud__info__icon hud__info__icon_${this._name}`;
        this._text.className = `hud__info__text hud__info__text_${this._name}`;
        if (this._text.textContent !== text) {
            this._text.textContent = text;
        }
    }

    show() {
        this._element.style.visibility = 'visible';
    }

    hide() {
        this._element.style.visibility = 'hidden';
    }
}


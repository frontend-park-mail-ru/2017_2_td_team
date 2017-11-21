import './hud.styl';
import Block from '../block/block.js';

export default class Hud extends Block {
    constructor(canvas) {
        super(document.createElement('div'));
        this._element.className = 'hud';

        this._canvas = canvas;

        this._leftSidebar = document.createElement('div');
        this._leftSidebar.className = 'hud__left-sidebar';

        this._rightSidebar = document.createElement('div');
        this._rightSidebar.className = 'hud__right-sidebar';

        this._bottomBar = document.createElement('div');
        this._bottomBar.className = 'hud__bottombar';

        this._element.appendChild(this._leftSidebar);
        this._element.appendChild(this._canvas);
        this._element.appendChild(this._rightSidebar);
        this._element.appendChild(this._bottomBar);
        console.log(this._element);
    }

    appendToLeftSidebar(element) {
        this._leftSidebar.appendChild(element);
    }

    appendBlockToLeftSidebar(block) {
        this._leftSidebar.appendChild(block._element);
    }

    appendToRightSidebar(element) {
        this._rightSidebar.appendChild(element);
        return element;
    }

    appendBlockToRightSidebar(block) {
        this._rightSidebar.appendChild(block._element);
        return element;
    }

    appendToBottombar(element) {
        this._bottomBar.appendChild(element);
    }

    appendBlockToBottombar(block) {
        this._bottomBar.appendChild(block._element);
    }
}

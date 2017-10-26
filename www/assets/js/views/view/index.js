import {globalEventBus} from '../../modules/globalEventBus.js';

export default class View {

    constructor(parentElement) {
        this._element = document.createElement('section');
        this._bus = globalEventBus;

        parentElement.appendChild(this._element);
    }

    render() {

    }

    start() {
        this.render();
    }

    resume() {
        this.show();
    }

    pause() {
        this.hide();
    }

    /**
     * Устанавливает аттрибут hidden компонента в true
     *
     * @returns {View}
     */
    hide() {
        this._element.hidden = true;
        return this;
    }

    /**
     * Устанавливает аттрибут hidden компонента в false
     *
     * @returns {View}
     */
    show() {
        this._element.hidden = false;
        return this;
    }

    /**
     * Инвертирует аттрибут hidden компонента
     *
     * @returns {View}
     */
    toggle() {
        this._element.hidden = !this._element.hidden;
        return this;
    }

}

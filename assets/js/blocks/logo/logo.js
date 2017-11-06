import './logo.styl';
import Block from '../block/block.js';

/**
 * Компонент логотипа игры
 *
 * @module Logo
 */
export default class Logo extends Block {
    /**
     * Конструирует логотип с заданными параметрами
     *
     * @param {string}text - текст логотипа
     * @param {*}attrs - объект с полями, содержащими аттрибуты компонента
     * @param {Array<string>}classes - список классов компонента
     */
    constructor(text, attrs = {}, classes = []) {
        super(document.createElement('a'));

        this._element.href = '/';

        this.setClasses(classes);
        this.setAttributes(attrs);
        this.text = text;
    }

}

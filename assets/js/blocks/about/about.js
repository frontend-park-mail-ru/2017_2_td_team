import './about.styl';

import Block from '../block/block.js';
import template from './about.pug';

/**
 * Компоненты секции about
 * @module About
 */
export default class About extends Block {
    /**
     * Создает компонент по шаблону window.aboutTemplate
     *
     * @param {*}attrs - объект с полями, содержищими аттрибуты компонента
     * @param {Array<string>}classes - список классов компонента
     */
    constructor(attrs = {}, classes = []) {
        super(document.createElement('div'));
        this.html = template();
        this.setClasses(classes);
        this.setAttributes(attrs);
    }
}

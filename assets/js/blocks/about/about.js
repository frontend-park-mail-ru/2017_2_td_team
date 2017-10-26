import './about.css';

import Block from '../block/block.js';

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
        this.html = require('./about.pug')();
        this.setClasses(classes);
        this.setAttributes(attrs);
    }
}

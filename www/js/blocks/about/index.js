import {Block} from '../block/index.js';

/**
 * Компоненты секции about
 * @module AboutPage
 */
export class AboutPage extends Block {
    /**
     * Создает компонент по шаблону window.aboutTemplate
     * [Шаблон] {@link 'about.pug'}
     */
    constructor() {
        super(document.createElement('div'));
        this.html = window.aboutTemplate();
        this.setClasses(['about']);
    }
}

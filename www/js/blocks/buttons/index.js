import {Block} from '../block/index.js';

/**
 * Компонент кнопки
 *
 * @module Button
 */
export class Button extends Block {
    /**
     * Конструирует кнопку по ее описанию
     *
     * @param description - описание, содержит  поля {*}attrs с аттрибутами, {Array<string>}classes с классами, {String}text с текстом
     */
    constructor(description) {
        const button = document.createElement('button');
        super(button);
        this.setClasses(description.classes);
        this.setAttributes(description.attrs);
        this.text = description.text;
    }
}

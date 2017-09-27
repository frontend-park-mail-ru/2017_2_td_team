import {Block} from '../block/index.js';

export class Button extends Block {
    constructor(description) {
        const button = document.createElement('button');
        super(button);
        this.setClasses(description.classes);
        this.setAttributes(description.attrs);
        this.text = description.text;
    }
}

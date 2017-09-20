import Block from '../block/index.js';

export class Logo extends Block {

    constructor(text, attrs = {}, classes = []) {
        super(document.createElement('div'));

        this.setClasses(classes);
        this.setAttributes(attrs);
        this.text = text;
    }

}

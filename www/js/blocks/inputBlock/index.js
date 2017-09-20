import Block from '../block/index.js';

export class InputBlock extends Block {
    constructor(description) {
        const input = document.createElement('div');
        super(input);
        this.setClasses(description.classes);
        this._element.innerHTML = window.inputBlockTemplate({field: description});
    }
}



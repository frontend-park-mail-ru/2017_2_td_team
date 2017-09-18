import Block from '../block/index.js';

export class InputBlock extends Block{
  constructor(description){
    const input = document.createElement('div');
    super(input);
    this.label = description.label;
    this.text = description.text;
    this.type = description.type;
    this._element.innerHTML = window.inputBlockTemplate({field:this});
  }
}



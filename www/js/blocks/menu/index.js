import Block from '../block/index.js';

export class Menu extends Block {
  constructor(buttons, attrs = {}, classes = []) {
    const menu = document.createElement('div');
    super(menu);
    this.setAttributes(attrs);
    this.setClasses(classes);
    buttons.forEach(button => this.append(button));
  }
}

import Block from '../block/index';
import {Button} from '../buttons/index';

export class Menu extends Block{
  constructor(buttons){
    const menu = document.createElement('div');
    super(menu);
    buttons.forEach(button => this.append(button))
  }
}

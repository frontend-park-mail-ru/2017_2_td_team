import Block from '../block/index';

export class Button extends Block{
  constructor(attrs = {}, classes = []){
    const button = document.createElement('button');
    super(button);
    this.setClasses(classes);
    this.setAttributes(attrs);
  }
}

import Block from '../block/index.js';

export class AboutPage extends Block{
  constructor(){
    super(document.createElement('div'));
    this.html = window.aboutTemplate();
    this.setClasses(['about'])
  }
}

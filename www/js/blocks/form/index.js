import Block from '../block/index.js';
import {InputBlock} from '../inputBlock/index.js';

export class Form extends Block {

  constructor(submitButton = null,inputs = [], attrs = {}, classes = []) {
    const form = document.createElement('form');
    super(form);
    inputs.forEach(field => this.append(field));
    if (submitButton){
      this.append(submitButton);
    }
    this.setClasses(classes);
  }

   onSubmit(callback) {
    this._element.addEventListener('submit', event => {
      event.preventDefault();
      const formdata = {};
      const elements = this._element.elements;
      for (let key in elements) {
        formdata[key] = elements[key].value;
      }
      callback(formdata);
    });
  }
}

export default class Block {

  constructor(element) {
    this._element = element;
  }

  static Create(tag = 'div', attrs = {}, classes = [], text = null) {
    const elem = document.createElement(tag);
    classes.forEach(className => elem.classList.add(className));

    for (let key in attrs) {
      elem.setAttribute(key, attrs[key]);
    }

    if (text) {
      elem.textContent = text;
    }
    return new Block(elem);
  }

  get text() {
    return this._element.textContent;
  }

  set text(content) {
    this._element.textContent = content;
  }

  clear() {
    this._element.innerHTML = '';
    return this;
  }

  hide() {
    this._element.hidden = true;
    return this;
  }

  show() {
    this._element.hidden = false;
    return this;
  }

  append(element) {
    this._element.appendChild(element);
    return this;
  }

  on(event, callback) {
    this._element.addEventListener(event, callback);
    return function () {
      this._element.removeEventListener(event);
    }.bind(this);
  }
}

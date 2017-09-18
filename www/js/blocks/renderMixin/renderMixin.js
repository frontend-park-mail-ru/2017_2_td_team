export class RenderMixin{
  static Inject(obj){
    return Object.setPrototypeOf(obj, mixin);
  }
}
const mixin = {

  set template(template){
    this._template = template;
  },

  get template(){
    return this._template;
  },

  render() {
    return this.template(this);
  },

};

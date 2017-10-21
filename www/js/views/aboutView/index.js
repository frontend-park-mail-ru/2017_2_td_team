import View from '../view/index.js';
import About from '../../blocks/about/index.js';

export default class AboutView extends View {

    render() {
        const about = new About({}, ['about', 'box']);

        about.injectTo(this._element);
    }

}

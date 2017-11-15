import View from '../view/index.js';
import About from '../../blocks/about/about.js';
import Button from '../../blocks/button/button.js';
import globalEventBus from '../../modules/globalEventBus.js';

export default class AboutView extends View {

    render() {
        const about = new About({}, ['about', 'box']);

        const button = new Button({
            attrs: {
                type: 'button',
            },
            text: 'Back',
            classes: ['button', 'menu-button'],
        });

        button.on('click', event => {
            event.preventDefault();
            globalEventBus.emit('router:redirect', {path: '/'});
        });

        about.append(button);
        about.injectTo(this._element);
    }

}

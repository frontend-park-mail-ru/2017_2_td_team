import View from '../view/index.js';
import MenuButtons from '../../configs/menu-buttons.js';
import Menu from '../../blocks/menu/menu.js';
import Button from '../../blocks/button/button.js';

export default class MainMenuView extends View {
    render() {
        const menuButtons = MenuButtons.map(button => new Button(button));
        const menu = new Menu(menuButtons, {}, ['box']);

        menu.injectTo(this._element);
    }

}

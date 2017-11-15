import './notifications.styl';
import Block from '../block/block.js';
import Notification from './__notification/notifications__notification';

export default class Notifications extends Block {
    constructor(parentNode) {
        super(document.createElement('div'));
        this._element.classList.add('notifications', 'notifications_hidden');

        parentNode.appendChild(this._element);
    }

    notify(message, duration) {
        let notification = new Notification(this._element, message, duration);
        notification.show();
    }
}

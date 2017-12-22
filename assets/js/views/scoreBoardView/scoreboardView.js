import scoresService from '../../services/scoresService/scoresService';
import ScoreBoardTemplate from './scoreboard.pug';
import View from '../view';
import './scoreboard.styl';
import Events from '../../events';

export default class ScoreboardView extends View {

    constructor(parent) {
        super(parent);
        this.scoresService = scoresService;
        this.pageSize = 10;
        this._element.addEventListener('click', event => this.routeEvent(event));

    }


    async resume() {
        this._bus.emit(Events.SPINNER_ON);
        this.currentPage = await this.scoresService.getInitialPage(this.pageSize);
        super.resume();
        this._bus.emit(Events.SPINNER_OFF);
    }

    async onNextPage() {
        this.currentPage = await this.scoresService.getNextPage(this.pageSize);
    }

    async onPrevPage() {
        this.currentPage = await this.scoresService.getPrevPage();
    }

    set currentPage(page) {
        this._element.innerHTML = ScoreBoardTemplate({context: page});
    }

    async routeEvent(event) {
        const direction = event.target.getAttribute('direction');
        if (direction === 'forward') {
            await this.onNextPage();
        } else if (direction === 'back') {
            await this.onPrevPage();
        }
    }
}

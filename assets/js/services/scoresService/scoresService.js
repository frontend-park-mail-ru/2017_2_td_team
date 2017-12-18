import {buildBackendUrl} from '../../configs/backend';
import globalEventBus from '../../modules/globalEventBus';
import Events from '../../events';
import Page from './page';
import Http from '../../modules/http';

class ScoresService {
    constructor() {
        this.bus = globalEventBus;
        this.pages = [];
        this.cacheTreshold = 10;
    }

    get currentPage() {
        return this.pages.length ? this.pages[this.pages.length - 1] : null;
    }

    set currentPage(page) {
        if (this.pages.length === this.cacheTreshold) {
            this.pages = this.pages.slice(this.cacheTreshold / 2);
        }
        this.pages.push(page);
    }

    async getInitialPage(pageSize) {
        try {
            const rawPage = await Http.get(buildBackendUrl(`/scores/page/${pageSize}`));
            const rawPageJson = await rawPage.json();
            this.currentPage = new Page(0, pageSize, rawPageJson.scores);
        } catch (e) {
            this.bus.emit(Events.NOTIFY, {message: e, duration: 5});
            return new Page(0, 0, {scores: []});
        }
        return this.currentPage;
    }

    async getNextPage(pageSize) {
        if (!this.currentPage) {
            return await this.getInitialPage(pageSize);
        }
        const url = `/scores/${this.currentPage.endMarker}/page/${pageSize}`;
        try {
            const rawPage = await Http.get(buildBackendUrl(url));
            const rawPageJson = await rawPage.json();
            this.currentPage = new Page(this.currentPage.pageNumber + 1, pageSize, rawPageJson.scores);
        } catch (err) {
            this.bus.emit(Events.NOTIFY, {message: 'Internal error: try again', duration: 5});
        }
        return this.currentPage;
    }

    getPrevPage() {
        if (this.pages.length === 0) {
            return null;
        }
        if (this.pages.length === 1) {
            return this.currentPage;
        }
        return this.pages[this.pages.length - 2];
    }

}
const scoresService = new ScoresService();
export default scoresService;


import {globalEventBus} from './globalEventBus';

class Router {

    constructor(root, views) {

        this.current = null;
        this.viewsParent = views;
        this.routes = new Map();
        this.currentView = null;
        this.bus = globalEventBus;
    }

    register(route, viewConstructor) {

        this.routes.set(route, RouteFactory.Create(viewConstructor(this.viewsParent)));

    }

    start() {
        window.onpopstate = () =>
            this.go(window.location.pathname);

        this.viewsParent.addEventListener('click', event => {
            if (event.target.tagName.toLowerCase() !== 'a') {
                return;
            }
            if (event.target.getAttribute('target') === '_blank') {
                return;
            }
            event.preventDefault();
            const pathname = window.location.pathname;
            this.go(pathname);
        });

        this.bus.register('router:redirect', (payload) => {
            this.go(payload.path);
        });

        this.go(window.location.pathname);
    }

    go(path) {
        route = this.routes.get(path);
    }


}

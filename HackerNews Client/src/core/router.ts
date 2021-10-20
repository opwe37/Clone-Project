import { RouteInfo } from '../types';
import View from './view';

export default class Router {
    private defaultRoute: RouteInfo | null;
    private routeTable: RouteInfo[];

    constructor() {
        this.routeTable = [];
        this.defaultRoute = null;

        window.addEventListener('hashchange', this.route.bind(this));
    }

    setDefaultPage(page: View): void {
        this.defaultRoute = { path: '', page };
    }

    addRoutePath(path: string, page: View): void {
        this.routeTable.push({ path, page });
    }

    route(): void {
        const routePath: string = location.hash;

        if (routePath === '' && this.defaultRoute) {
            this.defaultRoute.page.render();
        }

        for (const { path, page } of this.routeTable) {
            if (routePath.indexOf(path) >= 0) {
                page.render();
                break;
            }
        }
    }
}
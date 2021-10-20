// 기존: 함수 기반 코드
// 변경점: 클래스 기반 코드

interface Store {
    currentPage: number;
    feeds: NewsFeed[];
}

interface News {
    readonly id: number;
    readonly time_ago: string;
    readonly title: string;
    readonly url: string;
    readonly user: string;
    readonly content: string;
}

interface NewsFeed extends News {
    readonly comments_count: number;
    readonly points: number;
    read?: boolean;
}

interface NewsDetail extends News {
    readonly comments: NewsComment[];
}

interface NewsComment extends News {
    readonly comments: NewsComment[];
    readonly level: number;
}

interface RouteInfo {
    path: string;
    page: View;
}

const container: HTMLElement | null = document.getElementById('root');

const NEWS_URL: string = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL: string = 'https://api.hnpwa.com/v0/item/@id.json';

const store: Store = {
    currentPage: 1,
    feeds: [],
};

function applyApiMixins(targetClass: any, baseClasses: any[]): void {
    baseClasses.forEach((baseClass) => {
        Object.getOwnPropertyNames(baseClass.prototype).forEach((name) => {
            Object.defineProperty(
                targetClass.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseClass.prototype, name) || Object.create(null)
            );
        });
    });
}

class Api {
    getRequest<AjaxResponse>(url: string): AjaxResponse {
        const ajax = new XMLHttpRequest();
        ajax.open('GET', url, false);
        ajax.send();

        return JSON.parse(ajax.response);
    }
}

class NewsFeedApi { 
    getData(): NewsFeed[] {
        return this.getRequest<NewsFeed[]>(NEWS_URL)
    }
}

class NewsDetailApi { 
    getData(id: string): NewsDetail {
        return this.getRequest<NewsDetail>(CONTENT_URL.replace('@id', id));
    }
}

interface NewsFeedApi extends Api {};
interface NewsDetailApi extends Api {};

applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

// 추상 함수를 갖고 있는 함수는 추상 클래스로 선언되어야 함
abstract class View {
    private template: string;
    private renderTemplate: string;
    private container: HTMLElement;
    private htmlList: string[];

    constructor(containerId: string, template: string) {
        const containerElement = document.getElementById(containerId);

        if(!containerElement) {
            throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.';
        }
        
        this.container = containerElement;
        this.template = template;
        this.renderTemplate = template;
        this.htmlList = [];
    }

    protected updateView(): void {
        this.container.innerHTML = this.renderTemplate; 
        this.renderTemplate = this.template;
    }

    protected addHtml(htmlString: string): void {
        this.htmlList.push(htmlString);
    }

    protected getHtml(): string {
        const snapshot = this.htmlList.join('');
        this.clearHtmlList();
        return snapshot;
    }

    protected setTemplateData(key: string, value: string): void {
        this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
    }

    private clearHtmlList(): void {
        this.htmlList = [];
    }

    // 자식 클래스에게 render() 구현을 강제하기 위해 추상함수로 선언
    abstract render(): void;
}

class Router {
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

class NewsFeedView extends View {
    private api: NewsFeedApi;
    private feeds: NewsFeed[];

    constructor(containerId: string) {
        let template = `
            <div class="bg-gray-600 min-h-screen">
                <div class="bg-white text-xl">
                    <div class="mx-auto px-4">
                        <div class="flex justify-between items-center py-6">

                            <div class="flex justify-start">
                                <h1 class="font-extrabold">Hacker News</h1>
                            </div>

                            <div class="items-center justify-end">
                                <a href="#/page/{{__prev_page__}}" class="text-gray-500">Previous</a>
                                <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">Next</a>
                            </div>

                        </div> 
                    </div>
                </div>
                
                <div class="p-4 text-2xl text-gray-700">{{__news_feed__}}</div>
            </div>
        `;
        super(containerId, template);

        this.api = new NewsFeedApi();
        this.feeds = store.feeds;

        if (this.feeds.length === 0) {
            this.feeds = store.feeds = this.api.getData();
            this.makeFeed();
        }
    }

    render() {
        store.currentPage = Number(location.hash.substr(7) || 1);

        for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
            const { id, title, comments_count, user, points, time_ago, read } = this.feeds[i];
            this.addHtml(`
                <div class="p-6 ${read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                    <div class="flex">
                        <div class="flex-auto">
                            <a href="#/show/${id}">${title}</a>  
                        </div>
                        <div class="text-center text-sm">
                            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
                        </div>
                    </div>
                    <div class="flex mt-3">
                        <div class="grid grid-cols-3 text-sm text-gray-500">
                            <div><i class="fas fa-user mr-1"></i>${user}</div>
                            <div><i class="fas fa-heart mr-1"></i>${points}</div>
                            <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
                        </div>  
                    </div>
                </div>  
            `);
        }

        const min_page = 1;
        const max_page = this.feeds.length / 10;

        this.setTemplateData("news_feed", this.getHtml());
        this.setTemplateData("prev_page", String(store.currentPage > min_page ? store.currentPage-1 : min_page));
        this.setTemplateData("next_page", String(store.currentPage < max_page ? store.currentPage+1 : max_page));

        this.updateView();
    }

    private makeFeed(): void {
        for (let i = 0; i < this.feeds.length; i++) {
            this.feeds[i].read = false;
        }
    }
}

class NewsDetailView extends View {
    constructor(containerId: string) {
        let template = `
            <div class="bg-gray-600 min-h-screen pb-8">
                <div class="bg-white text-xl">
                    <div class="mx-auto px-4">
                        <div class="flex justify-between items-center py-6">
                            <div class="flex justify-start">
                                <h1 class="font-extrabold">Hacker News</h1>
                            </div>
                            <div class="items-center justify-end">
                                <a href="#/page/{{__currentPage__}}" class="text-gray-500">
                                    <i class="fa fa-times"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="h-full border rounded-xl bg-white m-6 p-4 ">
                    <h2>{{__title__}}</h2>
                    <div class="text-gray-400 h-20">
                    {{__content__}}
                    </div>

                    {{__comments__}}

                </div>
            </div>
        `;
        super(containerId, template);
    }

    render() {
        const id = location.hash.substr(7);
        const api = new NewsDetailApi();
        const newsDetail = api.getData(id);

        for (let i = 0; i < store.feeds.length; i++) {
            if (store.feeds[i].id === Number(id)) {
                store.feeds[i].read = true;
                break;
            }
        }

        this.setTemplateData('comments', this.makeComment(newsDetail.comments));
        this.setTemplateData('currentPage', String(store.currentPage));
        this.setTemplateData('title', newsDetail.title);
        this.setTemplateData('content', newsDetail.content);

        this.updateView();
    }
    
    private makeComment(comments: NewsComment[]): string {
        for (let i = 0; i < comments.length; i++) {
            const comment: NewsComment = comments[i];
            this.addHtml(`
                <div style="padding-left: ${40 * comment.level}px;" class="mt-4">
                    <div class="text-gray-400">
                        <i class="fa fa-sort-up mr-2"></i>
                        <strong>${comment.user}</strong> ${comment.time_ago}
                    </div>
                    <p class="text-gray-700">${comment.content}</p>
                </div>   
            `);

            if (comment.comments.length) {
                this.addHtml(this.makeComment(comment.comments));
            }
        }

        return this.getHtml();
    }
}

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);

router.route();
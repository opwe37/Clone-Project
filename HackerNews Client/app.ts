// interface vs type alias
// - 대부분 유사한 기능을 제공하지만, 일부 다른 기능이 있음
// - interface가 더 많은 기능을 제공해서 interface를 권장하긴 함
// 대표적 차이점: interface 내부에는 유니온, 교차 타입 불가

interface Store {
    currentPage: number;
    feeds: NewsFeed[];
}

// 지시어 사용
// readonly => 수정 불가 타입으로 만들어줌
interface News {
    readonly id: number;
    readonly time_ago: string;
    readonly title?: string;
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

const container: HTMLElement | null = document.getElementById('root');

const NEWS_URL: string = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL: string = 'https://api.hnpwa.com/v0/item/@id.json';

const store: Store = {
    currentPage: 1,
    feeds: [],
};

// getData(url: string): NewsFeed[] | NewsDetail {...}
// 사용하는 측면에서 어떤 데이터가 반환되는데? 라는 문제가 생김 => 제네릭!!!
function getData<AjaxResponse>(url: string): AjaxResponse {
    const ajax: XMLHttpRequest = new XMLHttpRequest();

    ajax.open('GET', url, false);
    ajax.send();

    return JSON.parse(ajax.response);
}

function makeFeed(feeds: NewsFeed[]): NewsFeed[] {
    for (let i = 0; i < feeds.length; i++) {
        feeds[i].read = false;
    }
    return feeds
}

function updateView(html: string): void {
    if (container) {
        container.innerHTML = html; 
    } else {
        console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.');
    }
}

function newsFeed(): void {
    let newsFeed: NewsFeed[] = store.feeds;
    const newsList = [];

    const min_page = 1;
    const max_page = newsFeed.length / 10;

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

    if (newsFeed.length === 0) {
        newsFeed = store.feeds = makeFeed(getData<NewsFeed[]>(NEWS_URL));
    }

    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
        // 뉴스 객체의 read 값에 따라 배경색 설정하도록 수정
        newsList.push(`
            <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                <div class="flex">
                    <div class="flex-auto">
                        <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
                    </div>
                    <div class="text-center text-sm">
                        <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
                    </div>
                </div>
                <div class="flex mt-3">
                    <div class="grid grid-cols-3 text-sm text-gray-500">
                        <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
                        <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
                        <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
                    </div>  
                </div>
            </div>  
        `);
    }

    template = template.replace("{{__news_feed__}}", newsList.join(''));
    template = template.replace("{{__prev_page__}}", String(store.currentPage > min_page ? store.currentPage-1 : min_page));
    template = template.replace("{{__next_page__}}", String(store.currentPage < max_page ? store.currentPage+1 : max_page));

    updateView(template);
}

function newsDetail(): void {
    const id = location.hash.substr(7);
    const newsContent = getData<NewsDetail>(CONTENT_URL.replace('@id', id));
    
    let template = `
        <div class="bg-gray-600 min-h-screen pb-8">
            <div class="bg-white text-xl">
                <div class="mx-auto px-4">
                    <div class="flex justify-between items-center py-6">
                        <div class="flex justify-start">
                            <h1 class="font-extrabold">Hacker News</h1>
                        </div>
                        <div class="items-center justify-end">
                            <a href="#/page/${store.currentPage}" class="text-gray-500">
                                <i class="fa fa-times"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="h-full border rounded-xl bg-white m-6 p-4 ">
                <h2>${newsContent.title}</h2>
                <div class="text-gray-400 h-20">
                ${newsContent.content}
                </div>

                {{__comments__}}

            </div>
        </div>
    `;

    // 글을 클릭해서 읽은 경우, read 속성을 true로 변경
    for (let i = 0; i < store.feeds.length; i++) {
        if (store.feeds[i].id === Number(id)) {
            store.feeds[i].read = true;
            break;
        }
    }

    updateView(template.replace('{{__comments__}}', makeComment(newsContent.comments)));
}

function makeComment(comments: NewsComment[]): string {
    const commentString = [];

    for (let i = 0; i < comments.length; i++) {
        const comment: NewsComment = comments[i];
        commentString.push(`
            <div style="padding-left: ${40 * comment.level}px;" class="mt-4">
                <div class="text-gray-400">
                    <i class="fa fa-sort-up mr-2"></i>
                    <strong>${comment.user}</strong> ${comment.time_ago}
                </div>
                <p class="text-gray-700">${comment.content}</p>
            </div>   
        `);

        if (comment.comments.length) {
            commentString.push(makeComment(comment.comments));
        }
    }

    return commentString.join('');
}

function router(): void {
    const routePath: string = location.hash;

    if (routePath === '') {
        newsFeed();
    } else if (routePath.indexOf('#/page/') >= 0) {
        store.currentPage = Number(routePath.substr(7));
        newsFeed();
    } else {
        newsDetail();
    }
}

window.addEventListener('hashchange', router);

router();
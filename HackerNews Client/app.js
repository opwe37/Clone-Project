// template 방식의 문제: 단적으로 템플릿 내 마킹되어 있는 지점이 많다면?
//                      마킹된 지점 만큼의 replace 구문이 등장해야 함
//                      - 이를 보완하기 위한 다양한 Template 라이브러리가 존재함
// TODO: Handlebars 라이브러리를 적용시켜보자

const container = document.getElementById('root');
const content = document.createElement('div');

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

const store = {
    currentPage: 1,
};

function getData(url) {
    const ajax = new XMLHttpRequest();

    ajax.open('GET', url, false);
    ajax.send();

    return JSON.parse(ajax.response);
}

function newsFeed() {
    const newsFeed = getData(NEWS_URL);
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

    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
        newsList.push(`
            <div class="p-6 bg-white mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
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
    template = template.replace("{{__prev_page__}}", store.currentPage > min_page ? store.currentPage-1 : min_page);
    template = template.replace("{{__next_page__}}", store.currentPage < max_page ? store.currentPage+1 : max_page);

    container.innerHTML = template;
}

function newsDetail() {
    const id = location.hash.substr(7);
    const newsContent = getData(CONTENT_URL.replace('@id', id));
    
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

    function makeComment(comments, depth = 0) {
        const commentString = [];

        for (let i = 0; i < comments.length; i++) {
            commentString.push(`
                <div style="padding-left: ${40 * depth}px;" class="mt-4">
                    <div class="text-gray-400">
                        <i class="fa fa-sort-up mr-2"></i>
                        <strong>${comments[i].user}</strong> ${comments[i].time_ago}
                    </div>
                    <p class="text-gray-700">${comments[i].content}</p>
                </div>   
            `);

            // 대댓글 처리를 위한 재귀호출
            if (comments[i].comments.length) {
                commentString.push(makeComment(comments[i].comments, depth+1));
            }
        }

        return commentString.join('');
    }

    container.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments));
}

function router() {
    const routePath = location.hash;

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
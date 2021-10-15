// 기존 문제점: DOM API를 최소화하면서 string 형식으로 변경하긴 했지만,
//             여전히 마크업 구조가 복잡해진다면, 전체 구조를 한눈에 파악하기 어려움
// 해결법: template 형식으로 변경 (전체 틀을 만들고, 필요할 때, 해당 부분을 채워넣는 형식)

// 진행사항: template방식 적용 + tailwindcss 맛보기 적용

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
        <div class="container mx-auto p-4">
            <h1>Hacker News</h1>
            <ul>
                {{__news_feed__}}
            </ul>
            <div>
                <a href="#/page/{{__prev_page__}}">이전 페이지</a>
                <a href="#/page/{{__next_page__}}">다음 페이지</a>
            </div>
        </div>
    `;

    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
        newsList.push(`
            <li>
                <a href="#/show/${newsFeed[i].id}">
                    ${newsFeed[i].title}(${newsFeed[i].comments_count})
                </a>
            </li>
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
    
    container.innerHTML = `
        <h1>${newsContent.title}</h1>

        <div>
            <a href="#/page/${store.currentPage}">목록으로</a>
        </div>
    `;
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
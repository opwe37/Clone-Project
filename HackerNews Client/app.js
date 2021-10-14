// 페이징 구현

const container = document.getElementById('root');
const content = document.createElement('div');

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

// 상태값 관리를 위한 저장소 선언
// 특정 페이징 위치에서 뉴스를 클릭해서 본 이후, 뒤로가기 했을때
// 어떤 페이징 위치를 보여줄지 기억하기위한 상태값 관리가 필요
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

    newsList.push('<ul>');
    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
        newsList.push(`
            <li>
                <a href="#/show/${newsFeed[i].id}">
                    ${newsFeed[i].title}(${newsFeed[i].comments_count})
                </a>
            </li>
        `);
    }
    newsList.push('</ul>');

    // 방어 코드 작성 (newFeed에서 제공하는 범위 밖으로 이동을 막기 위함)
    const min_page = 1;
    const max_page = newsFeed.length / 10;

    newsList.push(`
        <div>
            <a href="#/page/${store.currentPage > min_page ? store.currentPage-1 : min_page}">이전 페이지</a>
            <a href="#/page/${store.currentPage < max_page ? store.currentPage+1 : max_page}">다음 페이지</a>
        </div>
    `);
    container.innerHTML = newsList.join('');
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
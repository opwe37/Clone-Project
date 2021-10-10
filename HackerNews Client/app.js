// 기존의 문제점: 페이지 구분이 안됨
// 개선 방안: 라우터 기능 추가

const container = document.getElementById('root');
const content = document.createElement('div');

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

function getData(url) {
    const ajax = new XMLHttpRequest();

    ajax.open('GET', url, false);
    ajax.send();

    return JSON.parse(ajax.response);
}

// newsFeed(): 글 목록을 보여주는 화면을 그리는 함수
// 필요할 때, 이 함수를 불러 글 목록 화면을 그릴 수 있도록 함수화
// 재사용성↑
function newsFeed() {
    const newsFeed = getData(NEWS_URL);
    const newsList = [];

    newsList.push('<ul>');
    for (let i = 0; i < 10; i++) {
        newsList.push(`
            <li>
                <a href="#${newsFeed[i].id}">
                    ${newsFeed[i].title}(${newsFeed[i].comments_count})
                </a>
            </li>
        `);
    }
    newsList.push('</ul>');

    container.innerHTML = newsList.join('');
}

function newsDetail() {
    const id = location.hash.substr(1);
    const newsContent = getData(CONTENT_URL.replace('@id', id));
    
    container.innerHTML = `
        <h1>${newsContent.title}</h1>

        <div>
            <a href="#">목록으로</a>
        </div>
    `;
}

function router() {
    const routePath = location.hash;

    // 왜 동작하지? newsDetail()에서 id 값 가져올때는 '#'문자 때문에 1번 인덱스부터 읽었는데?
    // location.hash는 실제 주소의 해시에 '#'만 있을 경우에는 빈 값을 반환해주는 특징이 있음!!
    if (routePath === '') {
        newsFeed();
    } else {
        newsDetail();
    }
}

window.addEventListener('hashchange', router);

router();
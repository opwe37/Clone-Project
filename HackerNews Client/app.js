// 기존 JS에서 HTML을 조작하는 방식: DOM API 적극 활용
// 기존 방식의 문제점: HTML의 마크업 구조가 명확히 들어나지 않음
//                   (코드가 실제로 어떻게 그려질지에 대한 혼란 야기)
// 개선 방안: DOM API 사용 부분을 최소화하고 가능한 한 문자열로 대체

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

const newsFeed = getData(NEWS_URL);

const ul = document.createElement('ul');

window.addEventListener('hashchange', () => {
    const id = location.hash.substr(1);

    const newsContent = getData(CONTENT_URL.replace('@id', id));
    
    const title = document.createElement('h1');
    title.innerHTML = newsContent.title;

    content.innerHTML = '';

    content.appendChild(title);
});

for (let i = 0; i < 10; i++) {
    // 문자열을 실제 HTML요소로 변환시켜 저장하고 있을 임시 태그
    const div = document.createElement('div');
    div.innerHTML = `
        <li>
            <a href="#${newsFeed[i].id}">
                ${newsFeed[i].title}(${newsFeed[i].comments_count})
            </a>
        </li>
    `;

    // 동일한 코드 
    // ul.appendChild(div.children[0]);
    ul.appendChild(div.firstElementChild);
}

container.appendChild(ul);
container.appendChild(content);
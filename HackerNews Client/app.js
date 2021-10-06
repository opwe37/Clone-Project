const container = document.getElementById('root');

const ajax = new XMLHttpRequest();
const content = document.createElement('div');

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

ajax.open('GET', NEWS_URL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);

const ul = document.createElement('ul');

// 이벤트: 코드 상으로는 실행 시점을 알 수 없는 상황에서 사용하는 브라우저의 기능
window.addEventListener('hashchange', () => {
    // location: 주소 정보를 갖고 있는 객체
    // substr(idx): 스트링의 부분만 가져와서 쓰고 싶을때
    const id = location.hash.substr(1);
    ajax.open('GET', CONTENT_URL.replace('@id', id), false);
    ajax.send();

    const newsContent = JSON.parse(ajax.response);
    
    const title = document.createElement('h1');
    title.innerHTML = newsContent.title;

    // title이 누적되서 보여지는 버그를 잡기위해 추가
    content.innerHTML = '';

    content.appendChild(title);
});

for (let i = 0; i < 10; i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.innerHTML = `${newsFeed[i].title}(${newsFeed[i].comments_count})`;
    a.href = `#${newsFeed[i].id}`;

    li.appendChild(a);
    ul.appendChild(li);
}

container.appendChild(ul);
container.appendChild(content);
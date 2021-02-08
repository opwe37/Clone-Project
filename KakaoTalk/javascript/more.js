const notifyItems = [
    {
        category: '공지',
        text: '3.2.2 버전 업데이트 안내'
    }, {
        category: '나우',
        text: '카카오톡 지갑 속 새로운 인증서'
    }, {
        category: 'Tips',
        text: "컴알못'도 문제없어요~ 단축키 총정리"
    }
];

const rolling = document.querySelector('.rollingArea');

let rollingInterval = setInterval(addRollingItem, 3000);
// 마우스를 오렸을 때, 아이템 추가 동작을 멈추기 위함
rolling.addEventListener('mouseover', () => {
    clearInterval(rollingInterval);
});
rolling.addEventListener('mouseout', () => {
    rollingInterval = setInterval(addRollingItem, 3000);
});
// 하나의 아이템이 이동한 후, 최상위 아이템 제거
// 현재 보여지고 있는 아이템만 남도록
rolling.addEventListener('animationend', () => {
    rolling.children[0].remove();
    rolling.style.animationName = 'none';
});


let nextNotiIdx = 1;
function addRollingItem() {
    const newElement = document.createElement('div');
    newElement.setAttribute('class', 'item');
    newElement.setAttribute('data-idx', nextNotiIdx);
    rolling.appendChild(newElement);

    const head = document.createElement('span');
    head.setAttribute('class', 'text_header');
    head.innerText = notifyItems[nextNotiIdx].category;
    newElement.appendChild(head);

    const content = document.createElement('span');
    content.setAttribute('class', 'text_content');
    content.innerText = notifyItems[nextNotiIdx].text;
    newElement.appendChild(content);

    rolling.style.animationDuration = '1s';
    rolling.style.animationName = 'rolling';

    nextNotiIdx = (nextNotiIdx+1) % notifyItems.length;
}
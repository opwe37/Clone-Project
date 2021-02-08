function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const chatInfo = {
    nickName: getParameter('nickName'),
    imgUrl: getParameter('imgUrl')
}

document.querySelector('.header__img').src = chatInfo.imgUrl;
document.querySelector('.header__userName').innerHTML = chatInfo.nickName;

document.querySelector('.chatScreen img').src = chatInfo.imgUrl;
document.querySelector('.chatScreen .chatScreen__name').innerHTML = chatInfo.nickName;

function textArea_AutoResize(element) {
    element.style.height = '60px';
    element.style.height = element.scrollHeight+"px";

    if (element.value.length) 
        document.querySelector('.chatForm button').disabled = false;
    else
        document.querySelector('.chatForm button').disabled = true;
}

function chatSubmit() {
    const text = document.querySelector('textarea').value;
    const newChat = createNewChat(text);
    document.querySelector('.chat-main-screen').appendChild(newChat);
}

function createNewChat(text) {
    const section = document.createElement('section');
    section.setAttribute('class', 'myChat');

    const container = document.createElement('div');
    container.setAttribute('class', 'textContainer');

    const time = document.createElement('div');
    time.setAttribute('class', 'time');

    const balloon = document.createElement('div');
    balloon.setAttribute('class', 'balloon_right');
    balloon.innerText = text;

    section.appendChild(container);
    container.appendChild(time);
    container.appendChild(balloon);

    return section;
}
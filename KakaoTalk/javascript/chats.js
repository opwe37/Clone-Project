const chatList = [
    {
        nickName: 'My name',
        imgUrl: 'image/avatar_01.jpg'
    }
];

function moveChat(element) {
    location.href = "chat.html?nickName=" 
        + chatList[element.getAttribute('data')].nickName
        + "&imgUrl="
        + chatList[element.getAttribute('data')].imgUrl;
}
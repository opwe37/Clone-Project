const channels = [
    {
        nickName: 'Green Nexfilx',
        profileImageUrl: 'image/avatar_02.png',
        state: '못봤던 드라마 정주행중~',
    },
    {
        nickName: 'Aavator Channel',
        profileImageUrl: 'image/avatar_03.png',
        state: 'none',
    }
];

function addFriendList(list) {
    const container = document.querySelector('.channelSection');
    container.innerHTML = '';
    
    let i = 0;
    for (channel of list) {
        const cardContainer = document.createElement('div');
        cardContainer.setAttribute('class', 'friends_profile');
        cardContainer.setAttribute('data', i++);
        cardContainer.setAttribute('ondblclick', 'moveChat(this)');
        container.appendChild(cardContainer);

        const firendImg = document.createElement('img');
        firendImg.setAttribute('src', channel.profileImageUrl);
        cardContainer.appendChild(firendImg);

        const friendInfo = document.createElement('div');
        friendInfo.setAttribute('class', 'text');

        const friendNickName = document.createElement('div');
        friendNickName.setAttribute('class', 'name');
        friendNickName.textContent = channel.nickName;
        friendInfo.appendChild(friendNickName);

        if (channel.state != 'none') {
            const friendState = document.createElement('div');
            friendState.setAttribute('class', 'state');
            friendState.textContent = channel.state;
            friendInfo.appendChild(friendState);
        }
        cardContainer.appendChild(friendInfo);
        container.appendChild(cardContainer);
    }
}

function moveChat(element) {
    location.href = "chat.html?nickName=" 
        + channels[element.getAttribute('data')].nickName
        + "&imgUrl="
        + channels[element.getAttribute('data')].profileImageUrl;
}

addFriendList(channels);
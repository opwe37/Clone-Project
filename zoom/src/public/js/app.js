const socket = io();

const welcome = document.getElementById('welcome');
const roomNameForm = welcome.querySelector('#roomName');
const nickNameForm = welcome.querySelector('#name');

const room = document.getElementById('room');
room.hidden = true

let ROOM_NAME = '';

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement('li');
    li.innerHTML = message;
    ul.appendChild(li);
}

function showRoom(count) {
    welcome.hidden = true
    room.hidden = false

    const h3 = room.querySelector('h3');
    h3.innerText = `Room Name: ${ROOM_NAME} (${count})`;

    const msgForm = room.querySelector('#msg');
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleMessageSubmit(event) {
    event.preventDefault();

    const input = room.querySelector('#msg input');
    const value = input.value;
    socket.emit("new_message", value, ROOM_NAME, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();

    const input = nickNameForm.querySelector('input');
    const value = input.value;
    socket.emit("nickname", value, () => {
        socket['nickname'] = value;
    });
}

function handleRoomSubmit(event) {
    event.preventDefault();

    if (!socket['nickname']) {
        alert("Please Save the your Nickname");
        return;
    }

    const input = roomNameForm.querySelector('input');

    socket.emit("enter_room", input.value, showRoom);
    ROOM_NAME = input.value;
    input.value = '';
}

roomNameForm.addEventListener("submit", handleRoomSubmit);
nickNameForm.addEventListener("submit", handleNicknameSubmit);

// 클라이언트에서 서버에서 보낸 메시지를 대기
socket.on("welcome", (user, count) => {
    const h3 = room.querySelector('h3');
    h3.innerText = `Room Name: ${ROOM_NAME} (${count})`;
    addMessage(`${user} joined!!`);
});

socket.on("bye", (left, count) => {
    const h3 = room.querySelector('h3');
    h3.innerText = `Room Name: ${ROOM_NAME} (${count})`;
    addMessage(`${left} left ㅠㅠ`);
});

socket.on("new_message", addMessage);

socket.on('change_room', (rooms) => {
    console.log(rooms)
    const openRoomUl = welcome.querySelector('ul');
    openRoomUl.innerHTML = '';
    rooms.forEach(room => {
        const li = document.createElement('li');
        li.innerHTML = room;
        openRoomUl.append(li);
    });
});
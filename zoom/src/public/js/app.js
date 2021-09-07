const socket = io();

const welcome = document.getElementById('welcome');
const form = document.querySelector('form');

const room = document.getElementById('room');
room.hidden = true

let ROOM_NAME = '';

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement('li');
    li.innerHTML = message;
    ul.appendChild(li);

    room.querySelector('input').value = '';
}

function showRoom() {
    welcome.hidden = true
    room.hidden = false
}

function handleMessageSubmit(event) {
    event.preventDefault();

    const input = room.querySelector('input');
    socket.emit("new_message", input.value, ROOM_NAME, () => {
        addMessage(`You: ${input.value}`);
    });
}
room.addEventListener("submit", handleMessageSubmit);

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');

    socket.emit("enter_room", input.value, showRoom);
    ROOM_NAME = input.value;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room Name: ${ROOM_NAME}`;

    input.value = '';
}
form.addEventListener("submit", handleRoomSubmit);


socket.on("welcome", () => {
    addMessage("Someone joined!");
});

socket.on("bye", () => {
    addMessage("Someone left ㅠㅠ");
});

socket.on("new_message", addMessage);
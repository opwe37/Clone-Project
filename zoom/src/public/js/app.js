const socket = io();

const welcome = document.getElementById('welcome');
const form = document.querySelector('form');

const room = document.getElementById('room');
room.hidden = true

let ROOM_NAME = '';

function showRoom() {
    welcome.hidden = true
    room.hidden = false
}

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
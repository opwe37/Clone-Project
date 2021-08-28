const messageList = document.querySelector('ul');
const messageForm = document.querySelector('#message');
const nickNameForm = document.querySelector('#nickname');

// 브라우저와 연결한 서버의 소켓
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server ✔");
});

socket.addEventListener("message", (message) => {
    // message 객체에서 중요한 속성
    // - data
    // - timeStamp
    // const {sender, payload} = JSON.parse(message.data);

    const li = document.createElement('li');
    li.innerText = message.data;
    messageList.appendChild(li);
});

socket.addEventListener("close", () => {
    console.log("Disconnected to Server ❌");
});

function makeMessage(type, payload) {
    return JSON.stringify({type, payload});
}

function handleSubmit(event) {
    event.preventDefault();

    const input = messageForm.querySelector('input');
    socket.send(makeMessage("message", input.value));

    const li = document.createElement('li');
    li.innerText = `You: ${input.value}`;
    messageList.appendChild(li);

    input.value = '';
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickNameForm.querySelector('input');
    socket.send(makeMessage("nickname", input.value));
}

messageForm.addEventListener("submit", handleSubmit);
nickNameForm.addEventListener("submit", handleNickSubmit);
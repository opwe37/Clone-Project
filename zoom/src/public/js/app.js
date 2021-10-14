const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');

const store = {
    muted: false,
    cameraOff: false,
}

let myStream;

async function getMedia() {
    try {
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        myFace.srcObject = myStream;
    } catch (e) {
        console.log(e)
    }
}

getMedia();

function handleMuteClick() {
    if (!store.muted) {
        muteBtn.innerText = 'Unmute';
        store.muted = true;
    } else {
        muteBtn.innerText = 'Mute';
        store.muted = false;
    }
}

function handleCameraClick() {
    if (store.cameraOff) {
        cameraBtn.innerText = 'Turn Camera Off';
        store.cameraOff = false;
    } else {
        cameraBtn.innerText = 'Turn Camera On';
        store.cameraOff = true;
    }
}

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
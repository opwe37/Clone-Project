const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');

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
        await getCameras();
    } catch (e) {
        console.log(e)
    }
}

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind == 'videoinput');
        
        let template = `<option value="__id__">__label__</option>`;
        camerasSelect.innerHTML = '';
        for (let camera of cameras) {
            camerasSelect.innerHTML += template.replace('__id__', camera.deviceId).replace('__label__', camera.label);
        }
    } catch (err) {
        console.log(err);
    }
}

getMedia();

function handleMuteClick() {
    myStream
        .getAudioTracks()
        .forEach(track => track.enabled = !track.enabled)
    if (!store.muted) {
        muteBtn.innerText = 'Unmute';
        store.muted = true;
    } else {
        muteBtn.innerText = 'Mute';
        store.muted = false;
    }
}

function handleCameraClick() {
    myStream
        .getVideoTracks()
        .forEach(track => track.enabled = !track.enabled)
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
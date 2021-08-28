import http from 'http';
import express from 'express';
import WebSocket from 'ws';

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// DB 역할을 수행할 녀석
const sockets = [];

// wss.on(event, fn)
// - event: 정해진 이벤트가 있음
// - fn: 이벤트 발생 시, 수행할 함수
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";    // socket 이 객체라는 것을 이용해서 새로운 속성을 내가 부여할 수 있음
    console.log("Connected to Browser ✔");
    socket.on("close", () => { console.log("Disconnected from the Browser ❌")});
    
    socket.on("message", (message) => {

        const {type, payload} = JSON.parse(message.toString());
        
        switch (type) {
            case 'message':
                const targetSockets = sockets.filter(aSocket => socket != aSocket);
                targetSockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${payload}`));
                break;
            case 'nickname':
                socket["nickname"] = payload;
                break;
        }
    });
});

server.listen(3000, handleListen);
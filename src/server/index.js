const Storage = require('./storage');
const WebSocketServer = new require('ws');

let clients = {};
let currentId = 3;

const webSocketServer = new WebSocketServer.Server({port: 8080});

const storage = new Storage();

storage.addUser(1, "privet");
storage.addUser(2, "poka");

storage.addMessage(JSON.stringify({
    name: 'fgnh',
    text: "Я пробую что то добавить",
    time: "16:32"
}));
storage.addMessage(JSON.stringify({
    name: 'fgnh',
    text: "И сейчас",
    time: "16:32"
}));
storage.addMessage(JSON.stringify({
    name: 'fgnh',
    text: "Сейчас тоже",
    time: "16:33"
}));

webSocketServer.on('connection', (ws) => {
    const id = currentId++;
    clients[id] = ws;

    console.log("НОВОЕ СОЕДИНЕНИЕ");

    ws.on('message', (message) => {
        if (message.toString().slice(0, 2) === "_ ") {
            const _message = message.toString().slice(2, message.length);
            storage.addMessage(_message);

            for (const key in clients) {
                clients[key].send("_ " + _message);
            }
        } else if (message.toString().slice(0, 15) === "__GET_CONDITION") {
            const userName = message.toString().slice(16, message.length)
            storage.addUser(id, userName)

            clients[id].send(`__CONDITION ${getCondition()}`);
            for (let i = 1; i < currentId; i++) {
                clients[id].send(storage.getPhoto(i));
            }
        } else if (message.toString().slice(0, 1) === "�") {
            storage.addUserPhoto(id, message);
        }
        //console.log('получено сообщение ' + message);
    })

    ws.on('close', () => {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    })
})

function getCondition() {
    const users = storage.getUsers();
    console.log(users);
    const messages = storage.getMessages();
    const condition = {
        countUsers: Object.keys(users).length,
        users: users,
        messages: messages,
    }
    return JSON.stringify(condition);
}

console.log('Сервер запущен на порту 8080')

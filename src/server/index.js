const Storage = require('./storage');
const WebSocketServer = new require('ws');

let clients = {};
let currentId = 1;

const webSocketServer = new WebSocketServer.Server({port: 8080});

const storage = new Storage();

storage.addUser("privet", "./photo.png");
storage.addUser("poka", "./photo.png");

storage.addMessage(1, "Я пробую что то добавить", "16:31");
storage.addMessage(2, "Сейчас тоже", "16:32");
storage.addMessage(1, "И сейчас", "16:33");

webSocketServer.on('connection', (ws) => {
    const id = currentId++;
    clients[id] = ws;
    console.log("НОВОЕ СОЕДИНЕНИЕ");

    ws.on('message', (message) => {
        if (message.toString().slice(0, 15) === "__GET_CONDITION") {
            const data = JSON.parse(message.toString().slice(16, -1) + '}')
            storage.addUser(data.name, data.photo)
            clients[id].send(`__CONDITION ${getCondition()}`);
        }
        console.log('получено сообщение ' + message);
    })

    ws.on('close', () => {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    })
})

function getCondition() {
    const users = storage.getUsers();
    const messages = storage.getMessages();
    const condition = {
        users: users,
        messages: messages,
    }
    return JSON.stringify(condition);
}

console.log('Сервер запущен на порту 8080')

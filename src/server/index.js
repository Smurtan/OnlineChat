const Storage = require('./storage');
const WebSocketServer = new require('ws');

let clients = {};
let currentId = 3;

const webSocketServer = new WebSocketServer.Server({port: 8080});

const storage = new Storage();

webSocketServer.on('connection', (ws) => {
    const id = currentId++;
    clients[id] = ws;

    console.log("НОВОЕ СОЕДИНЕНИЕ");

    ws.on('message', (message) => {
        if (message.toString().slice(0, 2) === "_ ") {
            const _message = message.toString().slice(2, message.length);
            storage.addMessage(_message);

            for (const id in clients) {
                clients[id].send(message.toString());
            }
        }
        else if (message.toString().slice(0, 16) === "__GET_CONDITION ") {
            const userName = message.toString().slice(16, message.length)
            storage.addUser(id, userName)

            clients[id].send(`__CONDITION ${getCondition(id)}`);

            const userInfo = {
                id: id,
                userName: userName
            };
            for (const key in clients) {
                clients[key].send("__ADD_USER " + JSON.stringify(userInfo));
            }

            for (const key in clients) {
                const photo = storage.getPhoto(key);
                if (photo) {
                    clients[id].send("_PN " + key);
                    clients[id].send(photo);
                }
            }
        }
        else if (message.toString().slice(0, 1) === "�") {
            storage.addUserPhoto(id, message);

            for (const key in clients) {
                clients[key].send("_PN " + id);
                clients[key].send(message);
            }
        }
        //console.log('получено сообщение ' + message);
    })

    ws.on('close', () => {
        console.log('соединение закрыто ' + id);
        delete clients[id];
        storage.removeUser(id);
        for (const key in clients) {
            clients[key].send("__REMOVE_USER " + id);
        }
    })
})

function getCondition(id) {
    const users = storage.getUsers();
    const messages = storage.getMessages();

    for (const id in users) {
        users[id].id = id;
    }

    const condition = {
        currentId: id,
        users: users,
        messages: messages,
    }
    return JSON.stringify(condition);
}

console.log('Сервер запущен на порту 8080')

const Storage = require('./storage');
const WebSocketServer = new require('ws');
const {t} = require("@babel/core/lib/vendor/import-meta-resolve");

let clients = {};
let currentId = 1;

const webSocketServer = new WebSocketServer.Server({port: 8080});

const storage = new Storage();

webSocketServer.on('connection', (ws) => {
    let id = currentId++;
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
            let haveUser = false;

            let users = storage.getAllUsers();
            for (const user in users) {
                if (users[user].userName === userName) {
                    haveUser = true;
                    id = user;
                    clients[id] = clients[currentId - 1];
                    delete clients[currentId - 1];
                    storage.changeState(id);
                }
            }
            if (!haveUser) {
                storage.addUser(id, userName);
            }
            users = storage.getAllUsers();

            clients[id].send(`__CONDITION ${getCondition(id)}`);

            const userInfo = {
                id: id,
                userName: userName
            };
            for (const key in clients) {
                clients[key].send("__ADD_USER " + JSON.stringify(userInfo));
                clients[key].send("_PN " + id);
                clients[key].send(users[id].photo);
            }

            for (const key in users) {
                if (users[key].active) {
                    const photo = storage.getPhoto(key);
                    if (photo) {
                        clients[id].send("_PN " + key);
                        clients[id].send(photo);
                    }
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
        storage.changeState(id);
        for (const key in clients) {
            clients[key].send("__REMOVE_USER " + id);
        }
    })
})

function getCondition(id) {
    const users = storage.getUsers();
    const messages = storage.getMessages();

    const condition = {
        currentId: id,
        users: users,
        messages: messages,
    }
    return JSON.stringify(condition);
}

console.log('Сервер запущен на порту 8080')

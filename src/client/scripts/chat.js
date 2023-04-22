import chatTemplate from "../templates/chat/chat.hbs";
import loadingTemplate from "../templates/chat/loading.hbs";


export default class Chat {
    constructor(userName, photo) {
        this.userName = userName;
        this.photo = photo;

        this.plaseInsertion = document.getElementById("insertion");
        this.showLoadingWindow();

        this.login();
    }

    async login() {
        this.socket = await new WebSocket("ws://localhost:8080");

        this.socket.addEventListener('open', (e) => {
            console.log('Соединение установлено!');

            this.socket.send("__GET_CONDITION " + this.userName);
            this.socket.send(this.photo);
            //this.socket.send("__GET_CONDITION " + JSON.stringify(data));
        })

        this.socket.addEventListener('message', (message) => {
            if (message.data.slice(0, 2) === "_ ") {

            } else if (message.data.slice(0, 12) === "__CONDITION ") {
                const condition = JSON.parse(message.data.slice(12, message.data.length));
                console.log(condition);
                this.users = condition.users;
                this.users.countUsers = condition.countUsers;
                this.messages = condition.messages;
                this.ids = [];

                for (const id in this.users) {
                    this.ids.push(id);
                }
                this.currentUser = 0;
            } else if (message.data.toString().slice(0, 1) === "�") {
                if (this.currentUser < this.users.countUsers) {
                    if (message.data.length > 1) {
                        this.users[this.ids[this.currentUser]].photo = message;
                    } else {
                        this.users[this.ids[this.currentUser]].photo = undefined;
                    }
                    console.log(this.users);
                    console.log(message.data);
                    this.currentUser++;
                }
                if (this.currentUser === this.users.countUsers) {
                    this.showChatWindow(this.users, this.messages)
                }
            }
            //console.log(message.data);
        })

        this.socket.addEventListener('error', (e) => {
            console.log('ОШИБКА + ' + e);
        })

        this.socket.addEventListener('close', (e) => {
            console.log('Соединение закрыто!');
        })
    }

    showLoadingWindow(condition = {}) {
        this.plaseInsertion.innerHTML = loadingTemplate();
    }

    showChatWindow(users, messages) {
        delete users.countUsers;
        this.plaseInsertion.innerHTML = chatTemplate({users: users, messages: messages});

        this.inputMessageNode = this.plaseInsertion.querySelector('[data-role=input-message]');
        this.sendMessageNode = this.plaseInsertion.querySelector('[data-role=send-message]');

        this.inputMessageNode.addEventListener('change', this.sendMessage);
        this.sendMessageNode.addEventListener('click', this.sendMessage);
    }

    sendMessage() {
        this.socket.send("_ " + this.inputMessageNode.value);
        this.inputMessageNode.value = '';
    }

    addMessage() {

    }
}

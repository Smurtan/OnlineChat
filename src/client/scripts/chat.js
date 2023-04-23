import chatTemplate from "../templates/chat/chat.hbs";
import loadingTemplate from "../templates/chat/loading.hbs";
import messageBlockTemplate from "../templates/chat/message-block.hbs";
import messageItemTemplate from "../templates/chat/message-item.hbs";
import informationTemplate from "../templates/chat/information-message.hbs";
import userTemplate from "../templates/chat/user.hbs";

import Avatar from "../img/avatar.jpg";


export default class Chat {
    constructor(userName, photo) {
        this.userName = userName;
        this.photo = photo;

        this.date = new Date();

        this.plaseInsertionNode = document.getElementById("insertion");
        this.showLoadingWindow();

        this.login();
    }

    async login() {
        this.socket = await new WebSocket("ws://localhost:8080");

        this.socket.addEventListener('open', (e) => {
            this.socket.send("__GET_CONDITION " + this.userName);
            this.socket.send(this.photo);
        })

        this.socket.addEventListener('message', (message) => {
            if (message.data.slice(0, 2) === "_ ") {
                const _message = JSON.parse(message.data.toString().slice(2, message.data.length));
                this.addMessage(_message);
            }
            else if (message.data.slice(0, 12) === "__CONDITION ") {
                const condition = JSON.parse(message.data.slice(12, message.data.length));
                this.users = condition.users;
                this.messages = condition.messages;
                this.id = condition.currentId;
                this.showChatWindow(this.users, this.messages);
            }
            else if (message.data.slice(0, 4) === "_PN ") {
                this.currentGetPhotoId = message.data.slice(4, message.data.length);
            }
            else if (message.data.slice(0, 11) === "__ADD_USER ") {
                const userInfo = JSON.parse(message.data.toString().slice(11, message.data.length));
                if (this.id !== userInfo.id) {
                    this.addUser(userInfo);
                }
            }
            else if (message.data.slice(0, 14) === "__REMOVE_USER ") {
                const removeId = message.data.toString().slice(14, message.data.length);
                this.removeUser(removeId);
            }
            else if (message.data.type === "") {
                this.users[this.currentGetPhotoId].photo = URL.createObjectURL(message.data);
                this.addPhotoUser();
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
        this.plaseInsertionNode.innerHTML = loadingTemplate();
    }

    showChatWindow(users, messages) {
        delete users.currentId;
        for (const key in users) {
            users[key].photo = Avatar;
        }
        this.plaseInsertionNode.innerHTML = chatTemplate({users: users});

        this.inputMessageNode = this.plaseInsertionNode.querySelector('[data-role=input-message]');
        this.sendMessageNode = this.plaseInsertionNode.querySelector('[data-role=send-message]');

        this.messageListNode = this.plaseInsertionNode.querySelector('[data-role=message-list]');

        for (const mes of messages) {
            this.addMessage(mes);
        }

        this.changeCountUsers();

        this.sendMessageNode.addEventListener('click', () => {
            if (this.inputMessageNode.value) {
                const hour = this.date.getHours().length === 1 ? '0' + this.date.getHours() : this.date.getHours();
                const minutes = this.date.getMinutes().length === 1 ? '0' + this.date.getMinutes() : this.date.getMinutes();
                const message = {
                    id: this.id,
                    text: this.inputMessageNode.value,
                    time: hour + ":" + minutes,
                    userName: this.userName
                }
                this.socket.send("_ " + JSON.stringify(message));
                this.inputMessageNode.value = '';
            }
        });
    }

    changeCountUsers() {
        const countUsersNode = this.plaseInsertionNode.querySelector('[data-role=count-user]');
        countUsersNode.textContent = Object.keys(this.users).length + ' участников';
    }

    addPhotoUser() {
        const imgUserNodes = this.plaseInsertionNode.querySelectorAll(`[data-id='${this.currentGetPhotoId}'] IMG`);

        for (const node of imgUserNodes) {
            node.src = this.users[this.currentGetPhotoId].photo;
        }
        console.log(this.users);
    }

    addMessage(message) {
        if (message.id === this.lastMessageId) {
            const messageBlockNodes = this.messageListNode.querySelectorAll('ul[data-role=block-list]');
            messageBlockNodes[messageBlockNodes.length - 1].innerHTML += messageItemTemplate({text: message.text, time: message.time});
        } else {
            let photo = Avatar;
            if (this.users[message.id]) {
                photo = this.users[message.id].photo;
            }
            this.messageListNode.innerHTML += messageBlockTemplate({info: message, photo: photo});
            if (message.id === this.id) {
                this.messageListNode.lastElementChild.classList.add("message__block-my");
            }
            this.lastMessageId = message.id;
        }
        this.changeCountUsers();
        const lastMessageSenderUserNode = this.plaseInsertionNode.querySelector(`li[data-id='${message.id}'] [data-role=last-message]`);
        if (lastMessageSenderUserNode) {
            lastMessageSenderUserNode.textContent = message.text;
        }

        this.messageListNode.scrollTop = this.messageListNode.scrollHeight;
    }

    addUser(info) {
        const infoNode = informationTemplate({text: info.userName + " присоединился"});
        this.messageListNode.innerHTML += infoNode;

        const userNode = userTemplate({id: info.id, userName: info.userName, photo: Avatar});
        const userList = this.plaseInsertionNode.querySelector('[data-role=user-list]');
        userList.innerHTML += userNode;
        this.users[info.id] = info;
        this.users[info.id].photo = Avatar;
    }

    removeUser(id) {
        const infoNode = informationTemplate({text: this.users[id].userName + " вышел из чата"});
        this.messageListNode.innerHTML += infoNode;
        delete this.users[id];

        const userList = this.plaseInsertionNode.querySelector('[data-role=user-list]');
        const userNode = this.plaseInsertionNode.querySelector(`li[data-id='${id}']`);
        userList.removeChild(userNode);
    }
}

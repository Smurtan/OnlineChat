import chatTemplate from "../templates/chat/chat.hbs";
import loadingTemplate from "../templates/chat/loading.hbs";
import messageBlockTemplate from "../templates/chat/message-block.hbs";
import messageItemTemplate from "../templates/chat/message-item.hbs";
import informationTemplate from "../templates/chat/information-message.hbs";
import userTemplate from "../templates/chat/user.hbs";


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
            else if (message.data.slice(0, 1) === "�") {
                this.users[this.currentGetPhotoId].photo = message.data;
                this.addPhotoUser();
            }
            else if (message.data.slice(0, 11) === "__ADD_USER ") {
                const userInfo = JSON.parse(message.data.toString().slice(11, message.data.length));
                this.addUser(userInfo);
            }
            else if (message.data.slice(0, 14) === "__REMOVE_USER ") {
                const removeId = message.data.toString().slice(14, message.data.length);
                this.removeUser(removeId);
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
        this.plaseInsertionNode.innerHTML = chatTemplate({users: users, messages: messages});

        this.inputMessageNode = this.plaseInsertionNode.querySelector('[data-role=input-message]');
        this.sendMessageNode = this.plaseInsertionNode.querySelector('[data-role=send-message]');

        this.messageListNode = this.plaseInsertionNode.querySelector('[data-role=message-list]');

        this.sendMessageNode.addEventListener('click', () => {
            const message = {
                id: this.id,
                text: this.inputMessageNode.value,
                time: this.date.getHours() + ":" + this.date.getMinutes(),
                userName: this.userName
            }
            this.socket.send("_ " + JSON.stringify(message));
            this.inputMessageNode.value = '';
        });
    }

    addPhotoUser() {
        const photo = this.users[this.currentGetPhotoId].photo;
        const blobObj = new Blob([atob(photo)], { type: "application/images" });
        const src = URL.createObjectURL(blobObj);

        const imgUserNodes = this.plaseInsertionNode.querySelectorAll(`[data-id=${this.currentGetPhotoId}] IMG`);

        for (const node in imgUserNodes) {
            node.src = src;
        }
    }

    addMessage(message) {
        this.messageListNode.innerHTML += messageBlockTemplate({info: message});
        if (message.id === this.id) {
            this.messageListNode.lastElementChild.classList.add("message__block-my");
        }
        const lastMessageSenderUserNode = this.plaseInsertionNode.querySelector(`li [data-id=${message.id}] [data-role=last-message]`);
        if (message.text.length > 21) {
            lastMessageSenderUserNode.textContent = message.text.slice(0, 18) + "...";
        } else {
            lastMessageSenderUserNode.textContent = message.text;
        }
    }

    addUser(info) {
        const infoNode = informationTemplate({text: info.userName + " присоединился"});
        this.messageListNode.appendChild(infoNode);

        const userNode = userTemplate({id: info.id, userName: info.userName});
        const userList = this.plaseInsertionNode.querySelector('[data-role=user-list]');
        userList.appendChild(userNode);
    }

    removeUser(id) {
        const infoNode = informationTemplate({text: id + " вышел из чата"});
        this.messageListNode.appendChild(infoNode);

        const userNode = this.plaseInsertionNode.querySelector(`li [data-id=${id}]`);
        this.plaseInsertionNode.removeChild(userNode);
    }
}

import chatTemplate from "../../templates/chat/chat.hbs";

import UserList from "./ui/userList";
import UserPhoto from "./ui/userPhoto";
import MessageList from "./ui/messageList";
import MessageSender from "./ui/messageSender";
import WSClient from "./wsClient";
import ModalWindow from "./ui/modalWindow";


export default class Chat {
    constructor(userName, photo) {
        this.userName = userName;
        this.photo = photo;

        this.plaseInsertionNode = document.getElementById("insertion");
        this.initChat();

        this.wsClient = new WSClient(
            `ws://localhost:8080`,
            this.onMessage.bind(this),
        );
        this.modalWindow = new ModalWindow(
            this.plaseInsertionNode.querySelector('[data-role=modal-window]'),
            this.onUpload.bind(this)
        )

        this.ui = {
            userList: new UserList(
                this.plaseInsertionNode.querySelector('[data-role=user-list]'),
                this.plaseInsertionNode.querySelector('[data-role=count-user]')
            ),
            userPhoto: new UserPhoto(
                this.plaseInsertionNode.querySelector('[data-role=my-photo]'),
                this.onUpload.bind(this),
                this.modalWindow.show.bind(this.modalWindow)
            ),
            messageList: new MessageList(
                this.plaseInsertionNode.querySelector('[data-role=message-list]'),
                this.sideBarNode,
                userName,
            ),
            messageSender: new MessageSender(
                this.plaseInsertionNode.querySelector('[data-role=message-sender]'),
                this.onSend.bind(this)
            ),
        }

        this.onLogin();
        if (this.photo) {this.onUpload(this.photo)}
    }

    initChat() {
        this.burger = false;

        this.plaseInsertionNode.innerHTML = chatTemplate({
            photo: `http://localhost:8080/photos/${this.userName}.png?t=${Date.now()}`,
            userName: this.userName,
            countUser: "1 участник",
        });

        const burgerNode = this.plaseInsertionNode.querySelector('[data-role=toggle-users]');

        this.sideBarNode = this.plaseInsertionNode.querySelector('[data-role=sidebar]');
        this.nikNode = this.sideBarNode.querySelectorAll("H4");
        this.lastMessageNode = this.sideBarNode.querySelectorAll("[data-role=last-message]")

        burgerNode.addEventListener('click', (e) => {
            clearTimeout(this.timer);
            if (!this.burger) {
                this.sideBarNode.style.maxWidth = "80px";
                this.nikNode.classList.add('hidden');
                this.lastMessageNode.classList.add('hidden');
                this.burger = true;
            } else {
                this.sideBarNode.style.maxWidth = "300px";
                this.sideBarNode.style.width = "100%";
                this.timer = setTimeout(() => {
                    this.nikNode.classList.remove('hidden');
                    this.lastMessageNode.classList.remove('hidden');
                }, 300);
                this.burger = false;
            }
        })
    }

    async onLogin() {
        await this.wsClient.connect();
        this.wsClient.sendHello(this.userName);
    }

    onMessage({type, from, data}) {
        if (type === "text-message") {
            this.ui.messageList.add(from, data.message.text, data.message.time);
        } else if (type === "hello") {
            this.ui.userList.add(from);
            this.ui.messageList.addSystemMessage(`${from} вошёл в чат`);
        } else if (type === "user-list") {
            for (const item of data) {
                this.ui.userList.add(item);
            }
        } else if (type === "message-list") {
            for (const item of data) {
                this.ui.messageList.add(item.userName, item.text, item.time);
            }
        } else if (type === "goodbye") {
            this.ui.userList.remove(from);
            this.ui.messageList.addSystemMessage(`${from} вышел из чата`);
        } else if (type === "change-photo") {
            console.log(data);
            const imgUserNodes = this.plaseInsertionNode.querySelectorAll(
                `[data-user='${data.name}'] [data-role=photo-img]`
            );
            console.log(imgUserNodes);
            for (const node of imgUserNodes) {
                node.src = `http://localhost:8080/photos/${data.name}.png?t=${Date.now()}`;
            }
        }
    }

    onSend(text) {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const message = {
            text: text,
            time: hours + ":" + minutes
        }
        this.wsClient.sendTextMessage(message);
        this.ui.messageSender.clear();
    }

    onUpload(data) {
        this.ui.userPhoto.set(data);

        fetch('http://localhost:8080/upload-photo', {
            method: 'post',
            body: JSON.stringify({
                name: this.userName,
                image: data,
            })
        });
    }
}

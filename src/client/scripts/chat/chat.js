import chatTemplate from "../../templates/chat/chat.hbs";

import PhotoUser from "../../img/photo.png";

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
        this.modalWindow = new ModalWindow(this.plaseInsertionNode.querySelector('[data-role=modal-window]'))

        this.ui = {
            userList: new UserList(
                this.plaseInsertionNode.querySelector('[data-role=user-list]'),
                this.plaseInsertionNode.querySelector('[data-role=count-user]'),
                userName,
                this.modalWindow.show.bind(this)
            ),
            userPhoto: new UserPhoto(),
            messageList: new MessageList(
                this.plaseInsertionNode.querySelector('[data-role=message-list]'),
                userName
            ),
            messageSender: new MessageSender(
                this.plaseInsertionNode.querySelector('[data-role=message-sender]'),
                this.onSend.bind(this)
            ),
        }

        this.onLogin();
    }

    initChat() {
        this.burger = false;

        this.plaseInsertionNode.innerHTML = chatTemplate({
            photo: this.photo || PhotoUser,
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


        // document.addEventListener('dragover', e => {
        //     e.preventDefault()
        // })
        //
        // document.addEventListener('drop', e => {
        //     e.preventDefault();
        //
        //     if (this.getCurrentUser(e.target, this.id)) {
        //         const dt = e.dataTransfer;
        //
        //         if (dt.files && dt.files.length) {
        //             console.log('есть контакт')
        //             if (dt.files.size > 300000) {
        //                 alert("Изображение слишком большое!");
        //             } else {
        //                 for (const file of dt.files) {
        //                     const reader = new FileReader();
        //
        //                     reader.readAsDataURL(file);
        //                     reader.addEventListener('load', () => {
        //                         this.photo = file;
        //                         this.modalImageNode.src = reader.result;
        //                         this.users[this.id].photo = reader.result;
        //                         this.socket.send(this.photo);
        //                         this.addPhotoUser();
        //                     })
        //                 }
        //             }
        //         }
        //     }
        // })
    }

    async onLogin() {
        await this.wsClient.connect();
        this.wsClient.sendHello(this.userName);
    }

    onMessage({ type, from, data }) {
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
                this.ui.messageList.add(from, data.message.text, data.message.time);
            }
        } else if (type === "goodbye") {
            this.ui.userList.remove(from);
            this.ui.messageList.addSystemMessage(`${from} вышел из чата`);
        } else if (type === "change-photo") {

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

    // getCurrentUser(from, id) {
    //     do {
    //         console.log(from.dataset);
    //         if (from.dataset && from.dataset.id === id) {
    //             console.log('Есть картинка');
    //             return from
    //         }
    //     } while (from = from.parentNode)
    //
    //     return null;
    // }
    //
    // addPhotoUser() {
    //     const imgUserNodes = this.plaseInsertionNode.querySelectorAll(`[data-id='${this.currentGetPhotoId}'] IMG`);
    //
    //     for (const node of imgUserNodes) {
    //         node.src = this.users[this.currentGetPhotoId].photo;
    //     }
    // }
}

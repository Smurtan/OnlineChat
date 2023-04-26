import chatTemplate from "../templates/chat/chat.hbs";
import loadingTemplate from "../templates/chat/loading.hbs";
import messageBlockTemplate from "../templates/chat/message-block.hbs";
import messageItemTemplate from "../templates/chat/message-item.hbs";
import informationTemplate from "../templates/chat/information-message.hbs";
import userTemplate from "../templates/chat/user.hbs";

import Avatar from "../img/avatar.jpg";
import PhotoUser from "../img/photo.png";


export default class Chat {
    constructor(userName, photo) {
        this.userName = userName;
        this.photo = photo;

        this.shift = false;
        this.burger = false;

        this.date = new Date();

        this.plaseInsertionNode = document.getElementById("insertion");
        this.showLoadingWindow();

        this.login();
    }

    async login() {
        this.socket = await new WebSocket("ws://localhost:8080");

        this.socket.addEventListener('open', () => {
            this.socket.send("__GET_CONDITION " + this.userName);
            this.socket.send(this.photo);
        })

        this.socket.addEventListener('message', (message) => {
            if (message.data.slice(0, 2) === "_ ") {
                const _message = JSON.parse(message.data.toString().slice(2, message.data.length));
                this.addMessage(_message);
            } else if (message.data.slice(0, 12) === "__CONDITION ") {
                const condition = JSON.parse(message.data.slice(12, message.data.length));
                this.users = condition.users;
                this.messages = condition.messages;
                this.id = condition.currentId.toString();
                this.showChatWindow(this.users, this.messages);
            } else if (message.data.slice(0, 4) === "_PN ") {
                this.currentGetPhotoId = message.data.slice(4, message.data.length);
            } else if (message.data.slice(0, 11) === "__ADD_USER ") {
                const userInfo = JSON.parse(message.data.toString().slice(11, message.data.length));
                if (this.id !== userInfo.id.toString()) {
                    this.addUser(userInfo);
                }
            } else if (message.data.slice(0, 14) === "__REMOVE_USER ") {
                const removeId = message.data.toString().slice(14, message.data.length);
                this.removeUser(removeId);
            } else if (message.data.type === "") {
                if (message.data.size > 0) {
                    this.users[this.currentGetPhotoId].photo = URL.createObjectURL(message.data);
                    this.addPhotoUser();
                }
            }
            //console.log(message.data);
        })

        this.socket.addEventListener('error', (e) => {
            console.log('ОШИБКА + ' + e);
        })

        this.socket.addEventListener('close', () => {
            console.log('Соединение закрыто!');
        })
    }

    showLoadingWindow() {
        this.plaseInsertionNode.innerHTML = loadingTemplate();
    }

    showChatWindow(users, messages) {
        delete users.currentId;
        for (const key in users) {
            users[key].photo = Avatar;
        }
        this.plaseInsertionNode.innerHTML = chatTemplate({
            photo: PhotoUser,
            users: users,
            userName: this.userName,
            countUser: this.declinationCountUser(Object.keys(users).length)
        });

        this.inputMessageNode = this.plaseInsertionNode.querySelector('[data-role=input-message]');
        this.sendMessageNode = this.plaseInsertionNode.querySelector('[data-role=send-message]');

        this.messageListNode = this.plaseInsertionNode.querySelector('[data-role=message-list]');

        for (const mes of messages) {
            this.addMessage(mes);
        }

        this.changeCountUsers();

        this.sendMessageNode.addEventListener('click', () => {
            if (this.inputMessageNode.value.length > 0) {
                let that = this;
                this.sendMessage(that);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Enter' && !this.shift && this.inputMessageNode.value.length > 0) {
                e.preventDefault();
                let that = this;
                this.sendMessage(that);
            }
        })

        document.addEventListener('keydown', (e) => {
            if (e.code === 'shiftKey') {
                this.shift = true;
            }
        })

        document.addEventListener('keyup', (e) => {
            if (e.code === 'shiftKey') {
                this.shift = false;
            }
        })

        const burgerNode = this.plaseInsertionNode.querySelector('[data-role=toggle-users]');

        this.sideNode = this.plaseInsertionNode.querySelector('[data-role=sidebar]');
        this.nikNode = this.sideNode.querySelector("H4");
        this.lastMessageNode = this.sideNode.querySelector("[data-role=last-message]")

        burgerNode.addEventListener('click', (e) => {
            clearTimeout(this.timer);
            if (!this.burger) {
                this.sideNode.style.maxWidth = "80px";
                this.nikNode.classList.add('hidden');
                this.lastMessageNode.classList.add('hidden');
                this.burger = true;
            } else {
                this.sideNode.style.maxWidth = "300px";
                this.sideNode.style.width = "100%";
                this.timer = setTimeout(() => {
                    this.nikNode.classList.remove('hidden');
                    this.lastMessageNode.classList.remove('hidden');
                }, 300);
                this.burger = false;
            }
        })

        this.modalWindowNode = this.plaseInsertionNode.querySelector('[data-role=modal-window]');
        this.modalWindowNode.classList.add("hidden");

        this.modalWindowNode.querySelector('[data-role=modal-close]').addEventListener('click', () => {
            this.modalWindowNode.classList.add("hidden");
            if (this.photo) {
                this.users[this.id].photo = URL.createObjectURL(this.photo);
                this.socket.send(this.photo);
                this.addPhotoUser();
            }
        })

        this.modalWindowNode.addEventListener('click', (e) => {
            if (e.target.dataset.role === 'modal-window') {
                this.modalWindowNode.classList.add("hidden");
                if (this.photo) {
                    this.users[this.id].photo = URL.createObjectURL(this.photo);
                    this.socket.send(this.photo);
                    this.addPhotoUser();
                }
            }
        })

        this.modalImageNode = this.modalWindowNode.querySelector('[data-role=photo-img]');

        this.modalWindowNode.querySelector('[data-role=choose_img]').addEventListener('change', (e) => {
            if (e.target.files[0].size > 300000) {
                alert("Изображение слишком большое!");
            } else {
                this.photo = e.target.files[0];
                this.modalImageNode.src = URL.createObjectURL(e.target.files[0]);
            }
        });

        this.userListNode = this.plaseInsertionNode.querySelector('[data-role=user-list]');
        const myUserNode = this.userListNode.querySelector(`[data-id='${this.id}']`);

        this.userListNode.removeChild(myUserNode);
        this.userListNode.insertBefore(myUserNode, this.userListNode.firstElementChild);

        myUserNode.addEventListener('click', () => {
            this.modalWindowNode.classList.remove("hidden");
            this.modalImageNode.src = this.users[this.id].photo;
        })

        document.addEventListener('dragover', e => {
            e.preventDefault()
        })

        document.addEventListener('drop', e => {
            e.preventDefault();

            if (this.getCurrentUser(e.target, this.id)) {
                const dt = e.dataTransfer;

                if (dt.files && dt.files.length) {
                    console.log('есть контакт')
                    if (dt.files.size > 300000) {
                        alert("Изображение слишком большое!");
                    } else {
                        for (const file of dt.files) {
                            const reader = new FileReader();

                            reader.readAsDataURL(file);
                            reader.addEventListener('load', () => {
                                this.photo = file;
                                this.modalImageNode.src = reader.result;
                                this.users[this.id].photo = reader.result;
                                this.socket.send(this.photo);
                                this.addPhotoUser();
                            })
                        }
                    }
                }
            }
        })
    }

    getCurrentUser(from, id) {
        do {
            console.log(from.dataset);
            if (from.dataset && from.dataset.id === id) {
                console.log('Есть картинка');
                return from
            }
        } while (from = from.parentNode)

        return null;
    }

    sendMessage(that) {
        const hour = Math.round(that.date.getHours() / 10) === 0 ? '0' + that.date.getHours() : that.date.getHours();
        const minutes = Math.round(that.date.getMinutes() / 10) === 0 ? '0' + that.date.getMinutes() : that.date.getMinutes();
        const message = {
            id: that.id,
            text: that.inputMessageNode.value,
            time: hour + ":" + minutes,
            userName: that.userName
        }
        that.socket.send("_ " + JSON.stringify(message));
        that.inputMessageNode.value = '';
    }

    changeCountUsers() {
        const countUsersNode = this.plaseInsertionNode.querySelector('[data-role=count-user]');
        countUsersNode.textContent = this.declinationCountUser(Object.keys(this.users).length);
    }

    addPhotoUser() {
        const imgUserNodes = this.plaseInsertionNode.querySelectorAll(`[data-id='${this.currentGetPhotoId}'] IMG`);

        for (const node of imgUserNodes) {
            node.src = this.users[this.currentGetPhotoId].photo;
        }
    }

    addMessage(message) {
        if (message.id === this.lastMessageId) {
            const messageBlockNodes = this.messageListNode.querySelectorAll('ul[data-role=block-list]');
            messageBlockNodes[messageBlockNodes.length - 1].innerHTML += messageItemTemplate({
                text: message.text,
                time: message.time
            });
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
        this.userListNode.innerHTML += userNode;
        this.users[info.id] = info;
        this.users[info.id].photo = Avatar;

        this.userListNode.firstElementChild.addEventListener('click', () => {
            this.modalWindowNode.classList.remove("hidden");
            this.modalImageNode.src = this.users[this.id].photo;
        })
        this.changeCountUsers();
    }

    removeUser(id) {
        const infoNode = informationTemplate({text: this.users[id].userName + " вышел из чата"});
        this.messageListNode.innerHTML += infoNode;
        delete this.users[id];

        const userList = this.plaseInsertionNode.querySelector('[data-role=user-list]');
        const userNode = this.plaseInsertionNode.querySelector(`li[data-id='${id}']`);
        userList.removeChild(userNode);
    }

    declinationCountUser(count) {
        if (count % 10 === 1 && count !== 11) {
            return count + ' участник';
        } else if ((count % 10 === 2 || count % 10 === 3 || count % 10 === 4) && (count < 11 || count > 19)) {
            return count + ' участника';
        } else {
            return count + ' участников';
        }
    }
}

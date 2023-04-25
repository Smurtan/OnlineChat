const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, './data/users.json');
const messagePath = path.join(__dirname, './data/messages.json');

class Storage {
    constructor() {
        if (!fs.existsSync(messagePath)) {
            fs.writeFileSync(messagePath, '[]');
            this.messages = [];
        } else {
            this.messages = JSON.parse(fs.readFileSync(messagePath, 'utf8'));
        }
        this.users = {};
        setTimeout(() => {
            const len = this.messages.length;
            if (len > 100) {
                this.messages = this.messages.slice(len - 100, -1);
            }
        },1800000)
    }

    addUser(id, userName, photo) {
        this.users[id] = {
            id: id,
            userName: userName,
            photo: photo,
            active: true
        };
    }

    changeState(id) {
        this.users[id].active = !this.users[id].active;
    }

    addUserPhoto(id, photo) {
        this.users[id].photo = photo;
    }

    addMessage(message) {
        message = JSON.parse(message);
        this.messages.push({
            id: message.id,
            userName: message.userName,
            text: message.text,
            time: message.time
        });
    }

    getUsers() {
        const users = {};

        for (const id in this.users) {
            if (this.users[id].active) {
                users[id] = {
                    id: id,
                    userName: this.users[id].userName,
                    photo: this.users[id].photo,
                    active: this.users[id].active
                }
            }
        }

        return users;
    }

    getAllUsers() {
        return this.users;
    }

    getPhoto(id) {
        if (this.users[id].photo) {
            return this.users[id].photo;
        } else {
            return false;
        }
    }

    getMessages() {
        return this.messages;
    }
}

module.exports = Storage;

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

    addUser(id, userName) {
        this.users[id] = {
            userName: userName,
            photo: undefined
        };
    }

    removeUser(id) {
        delete this.users[id];
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

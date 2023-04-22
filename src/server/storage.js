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
        this.userId = 1;
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
        console.log(this.users[id]);
    }

    addUserPhoto(id, photo) {
        this.users[id].photo = photo;
    }

    addMessage(message) {
        message = JSON.parse(message);
        this.messages.push({
            userName: message.userName,
            text: message.text,
            time: message.time
        });
    }

    getUsers() {
        const users = {};

        for (const item in this.users) {
            users[item] = {
                userName: this.users[item].userName
            };
        }

        return users;
    }

    getPhoto(id) {
        if (this.users[id].photo) {
            return this.users[id].photo;
        } else {
            return "�";
        }
    }

    getMessages() {
        return this.messages;
    }
}

module.exports = Storage;

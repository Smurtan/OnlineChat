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

    addUser(userName, photo = "./photo.jpeg") {
        this.users[this.userId++] = {
            userName: userName,
            photo: photo
        };
        console.log(this.users);
    }

    addMessage(userId, text, time) {
        this.messages.push({
            userName: this.users[userId].userName,
            text: text,
            time: time
        });
        console.log(this.messages)
    }

    getUsers() {
        const users = [];

        for (const item in this.users) {
            users.push({
                userName: this.users[item].userName,
                photo: this.users[item].photo,
            });
        }

        return users;
    }

    getMessages() {
        return this.messages;
    }
}

module.exports = Storage;

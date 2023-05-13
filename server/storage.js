const fs = require('fs');
const path = require('path');
const messagePath = path.join(__dirname, './data/messages.json');

class Storage {
    constructor() {
        if (!fs.existsSync(messagePath)) {
            fs.writeFileSync(messagePath, '[]');
            this.messages = [];
        } else {
            this.messages = JSON.parse(fs.readFileSync(messagePath, 'utf8'));
        }

        setTimeout(() => {
            const len = this.messages.length;
            if (len > 100) {
                this.messages = this.messages.slice(len - 100, -1);
            }
        },1800000);
        setTimeout(() => {
            fs.writeFileSync(messagePath, JSON.stringify(this.messages));
        },30000);
    }

    addMessage(userName, message) {
        this.messages.push({
            userName: userName,
            text: message.text,
            time: message.time
        });
    }

    getAllMessages() {
        return this.messages;
    }
}

module.exports = Storage;

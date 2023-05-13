import {sanitize} from "../utils";
import systemInformationTemplate from "../../../templates/chat/system-information-message.hbs";
import messageItemTemplate from "../../../templates/chat/message-item.hbs";
import messageBlockTemplate from "../../../templates/chat/message-block.hbs";


export default class MessageList {
    constructor(list, usersNode, userName) {
        this.messageListNode = list;
        this.usersNode = usersNode;
        this.userName = userName;
        this.lastMessageFrom = null;
    }

    add(from, text, time) {
        text = sanitize(text);
        from = sanitize(from);
        time = sanitize(time);
        if (from === this.lastMessageFrom) {
            const messageBlockNodes = this.messageListNode.querySelectorAll('ul[data-role=block-list]');
            messageBlockNodes[messageBlockNodes.length - 1].innerHTML +=
                messageItemTemplate({
                    text: text,
                    time: time
                });
        } else {
            this.messageListNode.innerHTML += messageBlockTemplate({from: from, text: text, time: time, photo: `http://localhost:8080/photos/${from}.png?t=${Date.now()}`});
            if (from === this.userName) {
                this.messageListNode.lastElementChild.classList.add("message__block-my");
            }
            this.lastMessageFrom = from;
        }
        const lastMessageSenderUserNode = this.messageListNode.querySelector(`li[data-user='${from}'] [data-role=last-message]`);
        if (lastMessageSenderUserNode) {
            lastMessageSenderUserNode.textContent = text;
        }

        this.changeLastMessage(from, text);
        this.messageListNode.scrollTop = this.messageListNode.scrollHeight;
    }

    addSystemMessage(message) {
        this.messageListNode.innerHTML += systemInformationTemplate({text: message});
        this.messageListNode.scrollTop = this.messageListNode.scrollHeight;
    }

    changeLastMessage(userName, text) {
        const lastMessageNode = this.usersNode.querySelector(`[data-user='${userName}'] [data-role=last-message]`);
        if (lastMessageNode) {
            lastMessageNode.textContent = text;
        }
    }
}

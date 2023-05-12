import {sanitize} from "../utils";
import systemInformationTemplate from "../../../templates/chat/system-information-message.hbs";
import messageItemTemplate from "../../../templates/chat/message-item.hbs";
import Avatar from "../../../img/avatar.jpg";
import messageBlockTemplate from "../../../templates/chat/message-block.hbs";


export default class MessageList {
    constructor(list, userName) {
        this.messageListNode = list;
        this.userName = userName;
        this.lastMessageFrom = null;
    }

    add(from, text, time) {
        text = sanitize(text);
        if (from === this.lastMessageFrom) {
            const messageBlockNodes = this.messageListNode.querySelectorAll('ul[data-role=block-list]');
            messageBlockNodes[messageBlockNodes.length - 1].append(
                messageItemTemplate({
                    text: text,
                    time: time
                }));
        } else {
            let photo = Avatar;
            this.messageListNode.append(messageBlockTemplate({from: from, text: text, time: time, photo: photo}));
            if (from === this.userName) {
                this.messageListNode.lastElementChild.classList.add("message__block-my");
            }
            this.lastMessageFrom = from;
        }
        const lastMessageSenderUserNode = this.messageListNode.querySelector(`li[data-user='${from}'] [data-role=last-message]`);
        if (lastMessageSenderUserNode) {
            lastMessageSenderUserNode.textContent = text;
        }

        this.messageListNode.scrollTop = this.messageListNode.scrollHeight;
    }

    addSystemMessage(message) {
        this.messageListNode.append(systemInformationTemplate({text: message}));
        this.messageListNode.scrollTop = this.messageListNode.scrollHeight;
    }
}

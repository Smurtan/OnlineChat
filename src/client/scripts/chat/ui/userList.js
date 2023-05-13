import userTemplate from "../../../templates/chat/user.hbs";

export default class UserList {
    constructor(list, countUser) {
        this.userListNode = list;
        this.countUserNode = countUser;
        this.items = new Set();
    }

    changeDOM(userName) {
        let fragment = '';

        for (const name of this.items) {
            fragment += userTemplate({userName: name, photo: `http://localhost:8080/photos/${userName}.png?t=${Date.now()}`});
        }

        this.userListNode.innerHTML = fragment;
        this.countUserNode.textContent = this.declinationCountUser(this.items.size + 1);
    }

    add(userName) {
        this.items.add(userName);
        this.changeDOM(userName);
    }

    remove(userName) {
        this.items.delete(userName);
        this.changeDOM(userName);
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

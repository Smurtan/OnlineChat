import userTemplate from "../../../templates/chat/user.hbs";
import Avatar from "../../../img/avatar.jpg";

export default class UserList {
    constructor(list, countUser, userName, onClickMyUser) {
        this.userListNode = list;
        this.countUserNode = countUser;
        this.userName = userName;
        this.onClickMyUser = onClickMyUser;
        this.items = new Set();
    }

    changeDOM() {
        const fragment = document.createDocumentFragment();

        for (const name of this.items) {
            if (name === this.userName) {
                fragment.prepend(userTemplate({userName: name, photo: Avatar}));
            } else {
                fragment.append(userTemplate({userName: name, photo: Avatar}));
            }
        }

        this.userListNode.innerHTML = '';
        this.userListNode.append(fragment);

        this.userListNode.firstElementChild.addEventListener('click', () => {
            this.onClickMyUser();
        })

        this.countUserNode.textContent = this.declinationCountUser(this.items.size + 1);
    }

    add(userName) {
        this.items.add(userName);
        this.changeDOM();
    }

    remove(userName) {
        this.items.delete(userName);
        this.changeDOM();
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

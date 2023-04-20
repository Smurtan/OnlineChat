import AuthorisationTemplate from "../templates/authorisation/authorization.hbs";
import PhotoTemplate from "../templates/photo/photo.hbs";

import Image from "../img/2-04.png";

import Chat from "../chat.js";

export default class Authorisation {
    constructor() {
        this.plaseInsertion = document.getElementById("insertion");
        this.showAuthorisationWindow();
    }

    showAuthorisationWindow(userName = '') {
        this.plaseInsertion.innerHTML = AuthorisationTemplate();

        this.userNameNode = this.plaseInsertion.querySelector('[data-role=input_userName]');
        const signInButtonNode = this.plaseInsertion.querySelector('[data-role=sign_in]');

        this.userNameNode.value = userName;

        signInButtonNode.addEventListener('click', (e) => {
            this.userName = this.userNameNode.value;
            console.log(this.userName);
            if (this.userName.length > 0) {
                this.showChangePhotoWindow();
            }
            // Добавить ошибку с отсутствием ника
        })
    }

    showChangePhotoWindow() {
        this.plaseInsertion.innerHTML = PhotoTemplate({photo: Image});

        const cancelButtonNode = this.plaseInsertion.querySelector('[data-role=cancel]');
        const saveButtonNode = this.plaseInsertion.querySelector('[data-role=save]');

        cancelButtonNode.addEventListener('click', (e) => {
            this.showAuthorisationWindow(this.userName);
        })

        saveButtonNode.addEventListener('click', (e) => {
            this.signIn(this.userName);
        })
    }

    signIn(userName) {
        new Chat(userName)
    }
}

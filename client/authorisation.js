/* global Handlebars */

import "./templates/signin/authorization.html";
import Chat from "./chat";

export default class Authorisation {
    constructor() {
        const templateSign = this.addTemplate('sign');
        this.userNameNode = templateSign.querySelector('[data-role=input_userName]');
        const signInButtonNode = templateSign.querySelector('[data-role=sign_in]');

        signInButtonNode.addEventListener('click', (e) => {
            const userName = this.userNameNode.value;
            if (userName.length > 0) {
                this.userName = userName;
                this.changePhoto();
            }
            // Добавить ошибку с отсутствием ника
        })

        document.body.innerHTML = '';
        document.body.appendChild(templateSign);
    }

    addTemplate(role) {
        const template = document.createElement('div');

        const templateElements = document.getElementById("#authorization");
        const linksNode = templateElements.querySelectorAll('link');
        const templateElement = templateElements.querySelector(`[data-role=${role}]`)

        for (const linkNode of linksNode) {
            template.appendChild(linkNode);
        }

        template.appendChild(templateElement);

        return template
    }

    changePhoto() {
        const templatePhoto = this.addTemplate('change_photo');

        const cancelButtonNode = templatePhoto.querySelector('[data-role=cancel]');
        const saveButtonNode = templatePhoto.querySelector('[data-role=save]');

        this.signTemplate = document.body.innerHTML;

        cancelButtonNode.addEventListener('click', (e) => {
            document.body.innerHTML = this.signTemplate;
        })

        saveButtonNode.addEventListener('click', (e) => {
            this.signIn(this.userName);
        })

        document.body.innerHTML = '';
        document.body.appendChild(templatePhoto);
    }

    signIn(userName) {
        new Chat(userName)
    }
}

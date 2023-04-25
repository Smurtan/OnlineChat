import authorisationTemplate from "../templates/authorisation/authorization.hbs";
import photoTemplate from "../templates/photo/photo.hbs";

import Image from "../img/import.png";

import Chat from "./chat.js";
import {once} from "@babel/core/lib/gensync-utils/functional";

export default class Authorisation {
    constructor() {
        this.plaseInsertion = document.getElementById("insertion");
        this.showAuthorisationWindow();
    }

    showAuthorisationWindow(userName = '') {
        this.plaseInsertion.innerHTML = authorisationTemplate();

        this.userNameNode = this.plaseInsertion.querySelector('[data-role=input_userName]');
        const signInButtonNode = this.plaseInsertion.querySelector('[data-role=sign_in]');

        this.userNameNode.value = userName;

        this.userNameNode.addEventListener('change', () => {
            this.setUserName()
        })

        signInButtonNode.addEventListener('click', () => {
            this.setUserName()
        })
    }

    showChangePhotoWindow() {
        this.plaseInsertion.innerHTML = photoTemplate({photo: Image});

        const cancelButtonNode = this.plaseInsertion.querySelector('[data-role=cancel]');
        const saveButtonNode = this.plaseInsertion.querySelector('[data-role=save]');
        const inputImageNode = this.plaseInsertion.querySelector('[data-role=choose_img]');
        const showImageNode = this.plaseInsertion.querySelector('[data-role=show_img]');

        cancelButtonNode.addEventListener('click', () => {
            this.showAuthorisationWindow(this.userName);
        })

        saveButtonNode.addEventListener('click', () => {
            this.signIn(this.userName, this.photo);
        })

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                this.signIn(this.userName, this.photo);
            }
        }, {once: true})

        inputImageNode.addEventListener('change', (e) => {
            if (e.target.files[0].size > 300000) {
                alert("Изображение слишком большое!")
            } else {
                this.photo = e.target.files[0];
                showImageNode.src = URL.createObjectURL(e.target.files[0]);
            }
        })
    }

    signIn(userName, photo) {
        new Chat(userName, photo)
    }

    setUserName() {
        this.userName = this.userNameNode.value;
        if (this.userName.length > 0) {
            this.showChangePhotoWindow();
        } else {
            this.userNameNode.classList.add('free__nik');
        }
    }
}

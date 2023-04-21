import chatTemplate from "../templates/chat/chat.hbs";
import loadingTemplate from "../templates/chat/loading.hbs";


export default class Chat {
    constructor(userName, photo) {
        this.userName = userName;
        this.photo = photo;

        this.plaseInsertion = document.getElementById("insertion");
        this.showChatWindow();

        this.login();
    }

    async login() {

    }

    showLoadingWindow() {
        this.plaseInsertion.innerHTML = loadingTemplate();
    }

    showChatWindow() {
        this.plaseInsertion.innerHTML = chatTemplate();


    }

}

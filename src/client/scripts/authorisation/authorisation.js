import Chat from "../chat.js";
import loginNameWindow from "./ui/loginNameWindow";
import loginPhotoWindow from "./ui/loginPhotoWindow";

export default class Authorisation {
    constructor() {
        this.placeInsertion = document.getElementById("insertion");
        this.loginNameWindow = new loginNameWindow(
            this.placeInsertion,
            this.onInputName.bind(this),
        );
        this.loginPhotoWindow = new loginPhotoWindow(
            this.placeInsertion,
            this.onSing.bind(this),
            this.onCancelPhoto.bind(this),
        );
        this.loginNameWindow.init();
    }

    onInputName(userName) {
        this.userName = userName;
        this.loginPhotoWindow.init();
    }

    onCancelPhoto() {
        this.loginNameWindow.init(this.userName);
    }

    onSing(photo) {
        new Chat(this.userName, photo)
    }
}

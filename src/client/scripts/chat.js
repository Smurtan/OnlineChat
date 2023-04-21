import chatTemplate from "../templates/chat/chat.hbs";
import loadingTemplate from "../templates/chat/loading.hbs";


export default class Chat {
    constructor(userName, photo) {
        this.userName = userName;
        this.photo = photo;

        this.plaseInsertion = document.getElementById("insertion");
        this.showLoadingWindow();

        this.login();
    }

    async login() {
        this.socket = await new WebSocket("ws://localhost:8080");

        this.socket.addEventListener('open', (e) => {
            console.log('Соединение установлено!');
            const data = {
                name: this.userName,
                photo: this.photo
            }
            this.socket.send("__GET_CONDITION " + JSON.stringify(data));
        })

        this.socket.addEventListener('message', (e) => {
            console.log(e.data);
            console.log(e.data.slice(0, 12));
            console.log(e.data.slice(12, -1));
            if (e.data.slice(0, 12) === "__CONDITION ") {
                this.showChatWindow(e.data.slice(12, -1))
            }
            console.log('получено сообщение ' + e);
        })

        this.socket.addEventListener('error', (e) => {
            console.log('ОШИБКА + ' + e);
        })

        this.socket.addEventListener('close', (e) => {
            console.log('Соединение закрыто!');
        })
    }



    showLoadingWindow(condition = {}) {
        this.plaseInsertion.innerHTML = loadingTemplate();
    }

    showChatWindow(condition) {
        const data = JSON.parse(condition + '}');
        this.plaseInsertion.innerHTML = chatTemplate({users: data.users, messages: data.messages});
    }

}

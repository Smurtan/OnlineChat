export default class WSClient {
    constructor(url, onMessage) {
        this.url = url;
        this.onMessage = onMessage;
    }

    connect() {
        return new Promise((resolve) => {
            this.socket = new WebSocket(this.url);
            this.socket.addEventListener('open', resolve)
            this.socket.addEventListener('message', (message) => {
                this.onMessage(JSON.parse(message.data));
            })
            this.socket.addEventListener('error', (e) => {
                console.log('ОШИБКА + ' + e);
            })
            this.socket.addEventListener('close', () => {
                console.log('Соединение закрыто!');
            })
        })
    }

    sendHello(userName) {
        this.sendMessage("hello", { userName });
    }

    sendTextMessage(message) {
        this.sendMessage("text-message", { message });
    }

    sendMessage(type, data) {
        this.socket.send(
            JSON.stringify({
                type,
                data,
            })
        );
    }
}

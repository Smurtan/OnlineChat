export default class MessageSender {
    constructor(senderNode, onSend) {
        this.shift = false;
        this.onSend = onSend;
        this.inputMessageNode = senderNode.querySelector('[data-role=input-message]');
        this.sendMessageNode = senderNode.querySelector('[data-role=send-message]');

        this.sendMessageNode.addEventListener('click', () => {
            const message = this.inputMessageNode.value.trim();

            if (message) {
                this.onSend(message);
            }
        });

        document.addEventListener('keydown', (e) => {
            const message = this.inputMessageNode.value.trim();

            if (e.code === 'Enter' && !this.shift && message) {
                e.preventDefault();
                this.onSend(message);
            }
        })

        document.addEventListener('keydown', (e) => {
            if (e.code === 'shiftKey') {
                this.shift = true;
            }
        })

        document.addEventListener('keyup', (e) => {
            if (e.code === 'shiftKey') {
                this.shift = false;
            }
        })
    }

    clear() {
        this.inputMessageNode.value = '';
    }
}

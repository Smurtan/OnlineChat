export default class ModalWindow {
    constructor(modalWindowNode, onUpload) {
        this.modalWindowNode = modalWindowNode;
        this.onUpload = onUpload;
        this.hide();

        this.modalWindowNode.querySelector('[data-role=choose_img]').addEventListener('change', (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.addEventListener('load', () => this.onUpload(reader.result));
        });

        this.modalWindowNode.querySelector('[data-role=modal-close]').addEventListener('click', () => {
            this.hide();
        });

        this.modalWindowNode.addEventListener('click', (e) => {
            if (e.target.dataset.role === 'modal-window') {
                this.hide();
            }
        });

        this.modalWindowNode.addEventListener('dragover', (e) => {
            if (e.dataTransfer.items.length && e.dataTransfer.items[0].kind === 'file') {
                e.preventDefault();
            }
        });

        this.modalWindowNode.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer.items[0].getAsFile();
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.addEventListener('load', () => this.onUpload(reader.result));
        });
    }

    show() {
        this.modalWindowNode.classList.remove("hidden");
    }

    hide() {
        this.modalWindowNode.classList.add("hidden");
    }
}

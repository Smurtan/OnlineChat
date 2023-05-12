export default class ModalWindow {
    constructor(element) {
        this.modalWindowNode = element;
        this.modalImageNode = this.modalWindowNode.querySelector('[data-role=photo-img]');
        this.hide();

        this.modalWindowNode.querySelector('[data-role=modal-close]').addEventListener('click', () => {
            this.hide();
            // if (this.photo) {
            //     this.users[this.id].photo = URL.createObjectURL(this.photo);
            //     this.socket.send(this.photo);
            //     this.addPhotoUser();
            // }
        })

        this.modalWindowNode.addEventListener('click', (e) => {
            if (e.target.dataset.role === 'modal-window') {
                this.hide();
                // if (this.photo) {
                //     this.users[this.id].photo = URL.createObjectURL(this.photo);
                //     this.socket.send(this.photo);
                //     this.addPhotoUser();
                // }
            }
        })

        // this.modalWindowNode.querySelector('[data-role=choose_img]').addEventListener('change', (e) => {
        //     if (e.target.files[0].size > 300000) {
        //         alert("Изображение слишком большое!");
        //     } else {
        //         this.photo = e.target.files[0];
        //         this.modalImageNode.src = URL.createObjectURL(e.target.files[0]);
        //     }
        // });
    }

    show() {
        this.modalWindowNode.classList.remove("hidden");
    }

    hide() {
        this.modalWindowNode.classList.add("hidden");
    }
}

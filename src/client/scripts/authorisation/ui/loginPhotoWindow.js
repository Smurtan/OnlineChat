import loginPhotoTemplate from "../../../templates/authorisation/loginPhoto/loginPhoto.hbs";

import Image from "../../../img/photo.png";


export default class loginPhotoWindow {
    constructor(placeInsertion, onSign, onCancel) {
        this.placeInsertion = placeInsertion;
        this.onSing = onSign;
        this.onCancel = onCancel;
    }

    init() {
        this.placeInsertion.innerHTML = loginPhotoTemplate({ photo: Image });

        const cancelButtonNode = this.placeInsertion.querySelector('[data-role=cancel]');
        const saveButtonNode = this.placeInsertion.querySelector('[data-role=save]');
        const inputImageNode = this.placeInsertion.querySelector('[data-role=choose_img]');
        const showImageNode = this.placeInsertion.querySelector('[data-role=show_img]');

        cancelButtonNode.addEventListener('click', () => {
            this.onCancel();
        })

        saveButtonNode.addEventListener('click', () => {
            this.onSing(this.photo);
        })

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                this.onSing(this.photo);
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
}

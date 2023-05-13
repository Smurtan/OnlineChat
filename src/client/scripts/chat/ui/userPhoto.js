export default class UserPhoto {
    constructor(photoNode, onUpload, onClick) {
        this.photoNode = photoNode;
        this.onUpload = onUpload;
        this.onClickPhoto = onClick

        this.photoNode.addEventListener('dragover', (e) => {
            if (e.dataTransfer.items.length && e.dataTransfer.items[0].kind === 'file') {
                e.preventDefault();
            }
        });

        this.photoNode.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer.items[0].getAsFile();
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.addEventListener('load', () => this.onUpload(reader.result));
        });

        this.photoNode.addEventListener('click', this.onClickPhoto)
    }

    set(photo) {
        this.photoNode.src = photo;
    }
}

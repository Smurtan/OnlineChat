import loginNameTemplate from "../../../templates/authorisation/loginName/loginName.hbs";


export default class loginNameWindow {
    constructor(placeInsertion, onInputName) {
        this.placeInsertion = placeInsertion;
        this.onInputNameParent = onInputName;
    }

    init(userName = '') {
        this.placeInsertion.innerHTML = loginNameTemplate();

        this.userNameNode = this.placeInsertion.querySelector('[data-role=input_userName]');
        const signInButtonNode = this.placeInsertion.querySelector('[data-role=sign_in]');

        this.userNameNode.value = userName;

        this.userNameNode.addEventListener('change', () => {
            this.onInputName(this.userNameNode.value.trim());
        })

        signInButtonNode.addEventListener('click', () => {
            this.onInputName(this.userNameNode.value.trim());
        })
    }

    onInputName(userName) {
        if (userName) {
            this.onInputNameParent(userName);
        } else {
            this.userNameNode.classList.add('free__nik');
        }
    }
}

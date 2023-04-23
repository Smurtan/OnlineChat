const Handlebars = require('handlebars/runtime');

Handlebars.registerHelper('insert-img', (url) => {
    url = Handlebars.escapeExpression(url);
    let src = "../../img/logo.png"
    console.log(url);
    if (url) {
        const blobObj = new Blob([atob(url)], { type: "application/images" })
        src = URL.createObjectURL(blobObj);
    }
    return new Handlebars.SafeString(`<img class="user__logo" src="${src}">`)
})

module.exports = Handlebars;

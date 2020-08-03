destruirCookie = () => {
    $.get("http://localhost/MakerTech/server/webservice_usuario.php", {tipo: "destruirCookie"}).done((retorno) => {
        let json = $.parseJSON(retorno);
        if(json.status) {
            window.location = "../login_usuario.html";
        } 
    });
}

verifcarCookieUser  = () => {
    $.get("http://localhost/MakerTech/server/webservice_usuario.php", {tipo: "checkCookie"}).done((dados) => {
        let json = $.parseJSON(dados);
        if (json.status) {
            console.log(dados);
            let sair = `<li><a onclick="destruirCookie()">Sair<i class="material-icons right">input</i></a></li>`;
            console.log($('#nav-mobile').html())
            $('#nav-mobile').append(sair);
        } else {
            window.location = "../login_usuario.html"
        }
    });
} 

$(document).ready(() => {
    verifcarCookieUser();
});

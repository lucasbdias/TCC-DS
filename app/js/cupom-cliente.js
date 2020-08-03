$(document).ready(function () {
    listarCliente();
    destruirCookie = () => {
$.get("http://localhost/MakerTech/server/webservice_cliente.php", {tipo: "destruirCookie"}).done((retorno) => {
    let json = $.parseJSON(retorno);
    if(json.status) {
        window.location = "index.html";
    }
});
}

$.post("http://localhost/MakerTech/server/webservice_cliente.php", {tipo: "consultar", codigo: getCookie("idcliente")}).done((retorno) => {
        let json = $.parseJSON(retorno);
        $("#clienteNome").html(json.nome);
        $("#clienteEmail").html(json.email);
    });

//verficação do cookie
$.post("http://localhost/MakerTech/server/webservice_cliente.php", {tipo: "checkCookie"}).done((dados) => {
let json = $.parseJSON(dados);
if (json.status) {
    let sair = `<li><a onclick="destruirCookie()">Sair<i class="material-icons right">input</i></a></li>`;
    $('#nav-mobile').append(sair);
    $('#slide-out').append(sair);
}
});
});

function listarCliente() {

    $("#ltclient").html("");

    $.ajax({
        url: "http://localhost/MakerTech/server/webservice_cupom.php",
        metbod: "get",
        data: {
            "tipo": "consulta"
        },
        success: function (retorno) {

            let json = $.parseJSON(retorno);
            if (json.length != 0) {
                let x = 0;

                for (x = 0; x < json.length; x++) {
                    let dataum = json[x].data_expdicao;
                    let data = dataum.split("-");
                    let content = `
       
        <div class="card">
          <div class="card-image">
            <a class="btn-floating pulse halfway-fab waves-effect waves-light red"><i class="material-icons">local_offer</i></a>
          </div>
          <div class="card-content">
            <p>
                <label>
                    
                    <h5>Cupom</h5> <hr>
                    <span class="helper-text red-text" data-error="wrong" data-success="right">Copie o código abaixo</span> <br> <br>
                    <p class="txtbold teal-text">${json[x].titulo}<br><a href="https://www.makertechlabs.com.br/" class="right"> Use no site</a><br></p>
                    <p>Expira em: <span class="txtbold red-text">${data[2]+"-"+data[1]+"-"+data[0]}</span></p>
                    
                  <br>
                </label>
              </p>
          </div>
        </div>
      </div>
        <br> <br>    
       `;

                    $("#cupom").append(content);

                }
            } else {
                let content = `
            <div class="col s12 blue-grey lighten-5 bradius flow-text" id="msg-txt">
        <p>Não temos nenhum cupom disponivel no momento. <br>Não se esqueça, cante como se ninguém estivesse ouvindo! ;)</p>
    </div>               
            `;
                $("#cupom").append(content);
            }
        },
        timeout: 3000,
        error: function () {
            alert("erro ao encontrar servidor");
        }
    });
}

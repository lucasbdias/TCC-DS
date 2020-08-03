//Diretorio do WEBSERVICE
$(document).ready(() => {
    listar = () => {
        $.post(url_chat, {tipo: "listarConversaAberta"}).done((retorno) => {
                let json = $.parseJSON(retorno);
                for (var i = 0; i < json.length; i++) {
                    //console.log(json[i].idmensagem); este
                    console.log(json[i].msg.split(":")[1].split(",")[0].split('"')[1]);
                    var row = `<div>
                        <a  onclick="puxarConversa(${json[i].idmensagem})" id="headConverca" class="btn chat-submit-button">mensagem_${json[i].msg.split(":")[1].split(",")[0].split('"')[1]}</a>
                    </div>`;
                $("#menuConversas").append(row);
                }  
            });    
    }  
    
    lastMsg = (id) => {
        var ultimoP = $('#listaConversas div[class="col m12 col s12"] .box-gray p').last().html();
        var ultimoStrong = $('#listaConversas div[class="col m12 col s12"] .box-gray div strong').last().html();
        var ultimoSpan = $('#listaConversas div[class="col m12 col s12"] .box-gray div span').last().html();
        //console.log(ultimoP + " " + ultimoStrong + " " + ultimoSpan); este
        $.post(url_chat, {tipo: "ultimaMsg2", id: id}).done((retorno) => {
            let json = $.parseJSON(retorno); 
            //console.log(json); este
            let divJson = json.msg.split(",");
            let jsonTamanho = divJson.length;
            let nomeJson, msgJson, horaJson;
            nomeJson = divJson[jsonTamanho - 3];
            let divNome = nomeJson.split(":");
            let divNome2 = divNome[1].split('"');
            msgJson = divJson[jsonTamanho - 2];
            let divMsg = msgJson.split(":");
            let divMsg2 = divMsg[1].split('"');
            horaJson = divJson[jsonTamanho - 1];
            let divHora = horaJson.split(":");
            let divHora2 = divHora[1].split('"'); 
            let divHora3 = divHora[2].split('"');
            let divHoraFinal = divHora2[1] + ":" + divHora3[0];

            var row = `<div class="col m12 col s12">
            <div class="box-gray">
                <img class=" pull-left" ng-src="{{message.imageUrl}}" />
                <p>${divMsg2[1]}</p>
                <div>
                    <strong>${divNome2[1]}</strong>&nbsp;
                    <span class="date">${divHoraFinal}</span>
                </div>
            </div>
        </div>`;
        if (divMsg2[1] != ultimoP) {
            $("#listaConversas").append(row);
        }  
        });
        setTimeout((id) => {
            let ide = $('#idmensagem').val();
            lastMsg(ide);
        }, 2000);
        
    }
 
    lastMsg($("#idmensagem").val());

    ultimaMsg2 = (id) => {
        $.get(url_chat, {tipo: "ultimaMsg2", id: id}).done((retorno) => {
            let json = $.parseJSON(retorno); 
            //console.log(json); este
            let divJson = json.msg.split(",");
            let jsonTamanho = divJson.length;
            let nomeJson, msgJson, horaJson;
            nomeJson = divJson[jsonTamanho - 3];
            let divNome = nomeJson.split(":");
            let divNome2 = divNome[1].split('"');
            msgJson = divJson[jsonTamanho - 2];
            let divMsg = msgJson.split(":");
            let divMsg2 = divMsg[1].split('"');
            horaJson = divJson[jsonTamanho - 1];
            let divHora = horaJson.split(":");
            let divHora2 = divHora[1].split('"');
            let divHora3 = divHora[2].split('"');
            let divHoraFinal = divHora2[1] + ":" + divHora3[0];

            var row = `<div class="col m12 col s12">
            <div class="box-gray">
                <img class=" pull-left" ng-src="{{message.imageUrl}}" />
                <p>${divMsg2[1]}</p>
                <div>
                    <strong>${divNome2[1]}</strong>&nbsp;
                    <span class="date">${divHoraFinal}</span>
                </div>
            </div>
        </div>`;
            $("#listaConversas").append(row);
        });
    }

    listar();

    $.get("http://localhost/MakerTech/server/webservice_usuario.php", {tipo: "checkCookie"}).done((dados) => {
        console.log(dados);
        let json = $.parseJSON(dados);
        if (json.status == true) {
            $("#comCookie").show();
            $("#noCookie").hide();
        }
    });

    puxarConversa = (id) => {
        $("#listaConversas").html("");
        $.post(url_chat, {tipo: "listarConversaAdm", id: id}).done((retorno) => {
            //console.log(retorno); este
            let divRetorno = retorno.split("_");
            if (divRetorno[2] == 0) {
                let json = $.parseJSON(divRetorno[0]);
                for (var i = 0; i < json.length; i++) {
                    var row = `<div class="col m12 col s12">
                    <div class="box-gray">
                        <img class=" pull-left" ng-src="{{message.imageUrl}}" />
                        <p>${json[i].msg}</p>
                        <div>
                            <strong>${json[i].nome}:</strong>&nbsp;
                            <span class="date">${json[i].horario}</span>
                        </div>
                    </div>
                </div>`;
                    $("#idmensagem").val(id);
                    $("#listaConversas").append(row);
                }
            }
        });
    }
        
      

    $('#btnenviar').click(() => {
        let nome, msg, idmsg;
        nome = $('#txtNomeCliente').val();
        msg = $('#txtpergunta').val();
        idmsg = $("#idmensagem").val();
        $.post(url_chat, {tipo: "repostaConversa", txtmsg: msg, txtnome: "admin", id: idmsg}).done(() => {
            ultimaMsg2(idmsg);
            msg = $('#txtpergunta').val("");
        });
    });
});
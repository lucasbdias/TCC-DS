//Diretorio do WEBSERVICE
$(document).ready(() => {
    listar = () => {
        $('#listagem').html("");
        $('#pergunta').show();
        $('#novaPergunta').hide();
        $('#finalizarConversa').show();
        
        $.post(url_chat, {tipo: "listarConversa"}).done((retorno) => {
            console.log(retorno);
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
                    $("#idmensagem").val(divRetorno[1]);
                    $("#listagem").append(row);
                }
            } else {
                $('#pergunta').hide();
                $('#novaPergunta').show();
            }
        });
    }

    listar2 = () => {
        $('#listagem').show();
        $('#pergunta').show();
        $('#novaPergunta').hide(); 
        listar();
    }

    limparListagem = () => {
        $('#listagem').hide("");
        $('#pergunta').show();
    }
 
    lastMsg = (id) => {
        var ultimoP = $('#listagem div[class="col m12 col s12"] .box-gray p').last().html();
        var ultimoStrong = $('#listagem div[class="col m12 col s12"] .box-gray div strong').last().html();
        var ultimoSpan = $('#listagem div[class="col m12 col s12"] .box-gray div span').last().html();
        //console.log(ultimoP + " " + ultimoStrong + " " + ultimoSpan);
        $.post(url_chat, {tipo: "ultimaMsg2", id: id}).done((retorno) => {
            //console.log(retorno);
            let json = $.parseJSON(retorno); 
            //console.log(json);
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
        //$("#listagem").append(row);
        if (divMsg2[1] == ultimoP && divNome2[1] == ultimoStrong && divHoraFinal == ultimoSpan || divMsg[1] == "") {
            //console.log("boa"); este
        }
        else {
            if (divMsg2[1] != ultimoP)
                $("#listagem").append(row);
        }
        });
        setTimeout((id) => {
            let ide = $('#idmensagem').val();
            lastMsg(ide);
        }, 2000);
        
    } 

    lastMsg($("#idmensagem").val());

    listar(); 

    destruirCookie = () => {
        $.get(url_cliente, {tipo: "destruirCookie"}).done((retorno) => {
            let json = $.parseJSON(retorno);
            if(json.status) {
                window.location = "index.html";
            }
        });
    }

    //verficação do cookie
    $.post(url_cliente, {tipo: "checkCookie"}).done((dados) => {
        let json = $.parseJSON(dados);
        if (json.status) {
            let sair = `<li><a onclick="destruirCookie()">Sair<i class="material-icons right">input</i></a></li>`;
            $('#nav-mobile').append(sair);
            $('#slide-out').append(sair);
        }
    });

    $.post("http://localhost/MakerTech/server/webservice_cliente.php", {tipo: "consultar", codigo: getCookie("idcliente")}).done((retorno) => {
        let json = $.parseJSON(retorno);
        $("#clienteNome").html(json.nome);
        $("#clienteEmail").html(json.email);
    });

    $.post(url_cliente, {tipo: "checkCookie"}).done((dados) => {
        let json = $.parseJSON(dados);
        if (json.status) {
            $("#comCookie").show();
            $("#noCookie").hide();
        }
    });

    $.post(url_chat, {tipo: "qtdConversasAberta"}).done((resposta) => {
        let json = $.parseJSON(resposta);
        if (json.qtd == 0) {
            $('#pergunta').hide();
            $('#novaPergunta').show();
            $('#finalizarConversa').show();
        } else {
            if($('.box-gray').length == 0){
                $('#novaPergunta').show();
                $('#pergunta').hide();
                $('#finalizarConversa').hide();
            }  
        }
    });

    $.post(url_chat, {tipo: "consultaCliente", id: getCookie("idcliente")}).done((dados) => {
        let json = $.parseJSON(dados);
        $('#txtNomeCliente').val(json.nome);
    });


    $('#btnenviar').click(() => {
        let nome, msg, idmsg;
        nome = $('#txtNomeCliente').val();
        msg = $('#txtpergunta').val();
        idmsg = $("#idmensagem").val();
        $.post(url_chat, {tipo: "repostaConversa", txtmsg: msg, txtnome: nome, id: idmsg}).done(() => {
            msg = $('#txtpergunta').val("");
        });
    });

    $('#btnNovaConversa').click(() => {
        let nome, msg;
        nome = $('#txtNomeCliente').val();
        msg = $('#txtpergunta').val();
        $.post(url_chat, {tipo: "novaConversa", txtnome: nome, txtmsg: msg}).done(() => {
            //console.log(json);
            listar2();
            $('#finalizarConversa').show();
        })
    });

    $('#finalizarConversa').click(() => {
        let idmsg;
        idmsg = $("#idmensagem").val();
        $.post(url_chat, {tipo: "finalizarConversa", id: idmsg}).done((retorno) => {
            var dados = $.parseJSON(retorno);
            if (dados.sucesso) {
                M.toast({html: dados.sucesso});
                //alert(dados.sucesso);
                limparListagem();
                $('#pergunta').hide();
                $('#finalizarConversa').hide(); 
                $('#novaPergunta').show();
            }
            else if (dados.erros) {
                M.toast({html: dados.erros});
                //alert(dados.erros);
                limparListagem();
                $('#pergunta').hide();
                $('#novaPergunta').show();
            }
        });
    }); 
});
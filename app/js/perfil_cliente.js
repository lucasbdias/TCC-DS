//inicio Validar
function removerValidacao() {
    $("input").removeClass("is-valid");
    $("input").removeClass("is-invalid");
    $("select").removeClass("is-valid");
    $("select").removeClass("is-invalid");
}
//Fim Validar


//Inicio Limpar formulario
function limparFormulario() {   
    $("#txtnome").val("");
    $("#txtarea").val(0);
    $("#txtemail").val("");
    $("#txtsenha").val("");
}

function consultarCliente(codigo) {
    $('#listaPerfil .row .input-field label').html("");
    $('#btnenviar').text('Atualizar'); 

    $.get(url_cliente, {tipo: "consultar", codigo: codigo }).done((retorno) => {
        let json = $.parseJSON(retorno);
        $('#codigo').attr('value', codigo);
        //$('#codigo').val(codigo);
        $('#labelnome').append("<strong>Nome:</strong> " +json.nome);
        $('#labelarea').append("<strong>Área de atuação:</strong> " + json.area_atuacao);
        $('#labelemail').append("<strong>Email:</strong> " + json.email);
        $('#labelsenha').append("<strong>Senha:</strong> " + json.senha);
    }).fail(() => {
        alert("Erro ao se comunicar com o servidor");
    });
}

function consultarCliente2(codigo) {
    $('#listaPerfil .row .input-field label').html("");
    $('#modal1').modal('open'); 
    $('#btnenviar').text('Atualizar'); 

    $.get(url_cliente, {tipo: "consultar", codigo: codigo }).done((retorno) => {
        let json = $.parseJSON(retorno);
        $('#codigo').attr('value', codigo);
        //$('#codigo').val(codigo);
        $('#txtnome').val(json.nome);
        $('#txtarea').val(json.area_atuacao);
        $('#txtemail').val(json.email);
        $('#txtsenha').val(json.senha);
    }).fail(() => {
        M.toast({html: "Erro ao se comunicar com o servidor"});
        //alert("Erro ao se comunicar com o servidor");
    });
}

$(document).ready(() => {
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
            consultarCliente(getCookie("idcliente"));
            let sair = `<li><a onclick="destruirCookie()">Sair<i class="material-icons right">input</i></a></li>`;
            $('#nav-mobile').append(sair);
            $('#slide-out').append(sair);
        } else {
            window.location = "login_cliente.html"
        }
    }); 
    $.post("http://localhost/MakerTech/server/webservice_cliente.php", {tipo: "consultar", codigo: getCookie("idcliente")}).done((retorno) => {
        let json = $.parseJSON(retorno);
        $("#clienteNome").html(json.nome);
        $("#clienteEmail").html(json.email);
    });

    $('.modal').modal();
    $('#btn_alterar').click(() => {
        $('#modal1').modal('open');
        consultarCliente2(getCookie("idcliente"))
    });

    $("#btncancelar").click(() => {
        consultarCliente(getCookie("idcliente"));
    });

    $("#btnenviar").click(function()
{
    removerValidacao();

    let tipo, codigo, nome, area, email, senha;

    codigo = $("#codigo").val();
    nome = $("#txtnome").val();
    area = $("#txtarea").val();
    email = $("#txtemail").val();
    senha = $("#txtsenha").val();

    if (codigo == 0) 
        tipo = "cadastrar";
    else
        tipo = "alterar";

    if(verificarCampo(nome, 3))
        $("#txtnome").addClass("is-valid");
    else
        $("#txtnome").addClass("is-invalid");

    if (!verificarArea(area))
        M.toast({html: "invalido"});
        //alert("invalido");
    else 
        area =  verificarArea(area);
        $("#txtarea").addClass("is-valid");

    if(verificarEmail(email, 3))
        $("#txtemail").addClass("is-valid");
    else
        $("#txtemail").addClass("is-invalid");
    
    if(verificarCampo(senha, 6))
        $("#txtsenha").addClass("is-valid");
    else
        $("#txtsenha").addClass("is-invalid");
    
    var qt_derros = $("input.is-invalid").length;

    if(qt_derros == 0)
    {
        $.post(url_cliente, {
            tipo: tipo,
            codigo: codigo,
            txtnome: nome,
            txtarea: area,
            txtemail: email,
            txtsenha: senha
        }).done((retorno) => {
            var dados = JSON.parse(retorno);
            if (dados.sucesso) {
                M.toast({html: dados.sucesso});
                //alert(dados.sucesso);
            }
            else if (dados.erros) {
                M.toast({html: dados.erros});
                //alert(dados.erros);
            }
            consultarCliente(getCookie("idcliente"));
            limparFormulario();
        }).fail(() => {
            M.toast({html: "Erro ao comunicar o servidor, tente novamente!"});
            //alert("Erro ao comunicar o servidor, tente novamente!");
        });
    }
    else
    {
        // $("#msg-erro").html("Verificar os campos destacados");
        // $("#mensagem").slideDown("fast");
        M.toast({html: "Verificar os campos destacados"});
        //alert("Verificar os campos destacados");
    }
});

setTimeout(() => {
    if($('.lab label').html() ==  "") {
        window.location = "login_cliente.html";
    }
}, 2500);

});
//Diretorio do url_cliente

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
    //$('#modal1').modal();
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
        alert("Erro ao se comunicar com o servidor");
    });
}



function removerCliente(codigo) {
    if (confirm("Deseja realmente excluir esse produto?")) {
        $.post(url_cliente, {tipo: "excluir", codigo: codigo}).done((retorno) => {
            let dados = $.parseJSON(retorno);
            alert(dados.sucesso);
            listar();
        }).fail(function() {
            alert("Erro ao excluir produto.");
        });
    }
}


$(document).ready(function() { 
$('.modal').modal();
listar = () => {
    $("#tabela_listagem").html("");
    $.post(url_cliente, {tipo: "listar"}).done(function(retorno) {
        console.log(retorno);
        var json = $.parseJSON(retorno);
        for (var i = 0; i < json.length; i++) {
            var row = `<tr>
            <td>${json[i].idcliente}</td>
            <td>${json[i].nome}</td>
            <td>${json[i].area_atuacao}</td>
            <td>${json[i].email}</td>
            <td>${json[i].senha}</td>
            <td><button type="button" onclick="javascript:removerCliente(${json[i].idcliente})" id="btn_excluir" class="btn red"><i class="fa fa-trash white-text"></i></button> 
            <button type="button" onclick="javascript:consultarCliente(${json[i].idcliente})" id="btn_alterar" class="btn"><i class="fa fa-eye white-text"></i></button></td>
            <tr>`;
            $("#tabela_listagem").append(row);
        }
    }).fail(function() {
        alert("Erro ao mandar para o servidor");
    });   
}

listar();

$('#btncadastrar').click( () => {
    $('#modal1').modal('open');
});

//Inicio Cadastrar/alterar
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
        alert("invalido");
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
                alert(dados.sucesso);
            }
            else if (dados.erros) {
                alert(dados.erros);
            }
            listar();
            limparFormulario();
        }).fail(() => {
            alert("Erro ao comunicar o servidor, tente novamente!");
        });
    }
    else
    {
        // $("#msg-erro").html("Verificar os campos destacados");
        // $("#mensagem").slideDown("fast");

        alert("Verificar os campos destacados");
    }
});
//Fim Cadastrar/alterar
});